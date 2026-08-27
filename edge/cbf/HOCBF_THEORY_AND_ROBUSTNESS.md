# Higher-Order Control Barrier Functions — Theory & Robustness

**Cortex AI Nexus · Edge Kinetic Safety (Vector 2)**  
Aligns with `docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md` and the live solver in `actuator_cbf_solver.cpp`.

This document consolidates the mathematical foundations, robust extensions, adaptive designs, and practical safeguards developed for the single-actuator CBF-QP safety filter.

---

## 1. Nominal CBF-QP (Relative Degree 2)

Plant (double integrator):
\[
\ddot{q} = u
\]

Barrier:
\[
h(q) = q_{\max} - q
\]

Relative degree is 2 because the control appears only in the second derivative:
\[
\dot{h} = -\dot{q}, \qquad \ddot{h} = -u
\]

Practical CBF inequality used by `ActuatorCBFSolver`:
\[
u \le \gamma (q_{\max} - q) - \dot{q}
\]

QP solved at each cycle:
\[
\begin{align*}
\min_u \quad & \tfrac12 (u - u_{\rm nom})^2 \\
\text{s.t.} \quad & u_{\min} \le u \le u_{\max} \\
& u \le \gamma (q_{\max}-q) - \dot{q}
\end{align*}
\]

On QP failure the solver returns \(u_{\min}\) (emergency deceleration).

---

## 2. Higher-Order CBFs (HOCBF)

For a barrier of relative degree \(r\) define the recursive auxiliaries:
\[
\begin{aligned}
\psi_0 &= h, \\
\psi_i &= L_f \psi_{i-1} + \alpha_i(\psi_{i-1}), \quad i=1,\dots,r-1.
\end{aligned}
\]

The HOCBF constraint is the relative-degree-1 condition on the last auxiliary:
\[
L_f\psi_{r-1} + L_g\psi_{r-1}\,u + \alpha_r(\psi_{r-1}) \ge 0.
\]

This remains affine in \(u\) and therefore fits the same real-time QP structure.

Relative degree 2 recovers the inequality already implemented in the edge solver.

---

## 3. Robust HOCBF Variants

### 3.1 Bounded additive disturbance
True dynamics: \(\dot{x} = f + g u + d\), \(\|d\|\le\delta\).

Worst-case tightening:
\[
L_g\psi_{r-1}\,u \ge -L_f\psi_{r-1} - \alpha_r(\psi_{r-1}) + \Delta(x),
\]
where \(\Delta(x) = \|\nabla\psi_{r-1}\|\delta\).

### 3.2 Input-to-State Safety (ISSf)
Allow a controlled barrier violation bounded by disturbance size:
\[
h(x(t)) \ge -\gamma(\|d\|_{[0,t]}).
\]

### 3.3 Filtered / high-gain forms
Replace pure differentiation by stable filters (dirty derivatives, high-gain observers) to limit noise amplification on higher-order terms.

---

## 4. Adaptive Robust HOCBF

### 4.1 Parametric model
\[
\dot{x} = f_0(x) + Y(x)\theta + g(x)u, \qquad \theta\text{ unknown constant}.
\]

### 4.2 Adaptive law (ideal)
\[
\dot{\hat{\theta}} = -\Gamma Y_{r-1}^\top \psi_{r-1}.
\]

### 4.3 Adaptive HOCBF constraint
\[
L_g\hat{\psi}_{r-1}\,u \ge -L_{f_0}\hat{\psi}_{r-1} - \hat{Y}_{r-1}\hat{\theta} - \alpha_r(\hat{\psi}_{r-1}) - \sigma\|\tilde{\theta}\|^2.
\]

Lyapunov function:
\[
V = \tfrac12\sum_{i=0}^{r-1}\psi_i^2 + \tfrac12\tilde{\theta}^\top\Gamma^{-1}\tilde{\theta}.
\]

Under the adaptive constraint, \(\dot{V}\le 0\) when \(\theta\) is constant, guaranteeing forward invariance of the safe set.

---

## 5. Time-Varying Parameters & Parameter Drift

When \(\theta=\theta(t)\) the ideal cancellation leaves a residual
\[
-\tilde{\theta}^\top\Gamma^{-1}\dot{\theta}.
\]

Pure adaptation then only guarantees **practical safety** (ultimate boundedness of barrier violation) under a bounded rate \(\|\dot{\theta}\|\le\delta_\theta\).

**Parameter drift** occurs when the live regressor loses rank or the system rests near the safe set: the adaptive law becomes a pure integrator of noise and \(\|\tilde{\theta}\|\) can wander without bound, invalidating the safety certificate.

---

## 6. σ-Modification — Lyapunov Proof

Adaptive law with leakage:
\[
\dot{\hat{\theta}} = -\Gamma Y_{r-1}^\top\psi_{r-1} - \sigma\Gamma\hat{\theta}, \qquad \sigma>0.
\]

After substitution and completion of squares one obtains
\[
\dot{V} \le -W(\psi) - \tfrac{\sigma}{2}\|\tilde{\theta}\|^2 + C,
\]
where the residual constant \(C\) depends on \(\|\theta\|\) and \(\|\dot{\theta}\|\).

Consequently all signals are **uniformly ultimately bounded**. The barrier function enters and remains inside a ball whose radius is tunable by \(\sigma\) and the disturbance bounds. This restores robustness against both time-varying parameters and pure drift.

---

## 7. Concurrent Learning

Concurrent learning augments the adaptive law with a gradient term built from a recorded history stack of past regressors:
\[
\dot{\hat{\theta}}
= -\Gamma Y(t)^\top e(t)
- \Gamma\sum_{j=1}^N Y_j^\top(Y_j\hat{\theta} - \mathcal{R}_j).
\]

Once the stack matrix \(\sum Y_j^\top Y_j\) is full rank, parameter error converges exponentially **without persistent excitation of the live regressor**. Parameter drift is eliminated and the HOCBF constraint is evaluated with an increasingly accurate model.

Practical notes for the edge module:
- Stack size 20–40 points is usually sufficient for low-dimensional parameters.
- Recording can run at a lower rate than the control loop.
- Can be combined with σ-modification for hybrid guarantees.

---

## 8. Implementation Guidance for `edge/cbf`

| Goal | Recommended approach |
|------|----------------------|
| Current production solver | Keep the existing relative-degree-2 CBF-QP (already real-time safe) |
| Bounded model error | Add additive disturbance margin \(\Delta\) to the CBF upper bound |
| Unknown but slowly varying parameters | Adaptive HOCBF + σ-modification (or projection) |
| Long-duration autonomy, risk of drift | Concurrent learning + σ-modification |
| Highest integrity | Hybrid: concurrent learning + hard robust margin + existing \(u_{\min}\) backup |

All variants preserve a **single affine constraint** on \(u\) and therefore remain compatible with the existing OSQP warm-started QP at ~1 kHz.

---

## 9. Safety Disclaimer

The code and theory in this directory are research / prototype grade.  
Validate on hardware with proper limits, watchdogs, and E-stop before any physical deployment.  
CBF/HOCBF methods provide formal guarantees only under the stated modelling assumptions; residual uncertainty must be handled by the robust or adaptive layers above (or by a certified backup controller).

---

**Document status:** Active synthesis from Cortex AI Nexus edge kinetic safety development.  
**Primary solver:** `edge/cbf/actuator_cbf_solver.cpp`  
**Architecture reference:** `docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md` (Vector 2)
