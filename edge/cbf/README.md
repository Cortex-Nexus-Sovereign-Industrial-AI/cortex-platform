# Edge CBF — Actuator Control Barrier Function Solver

**Cortex AI Nexus · Kinetic safety kernel (Vector 2)**  
Aligns with [TECHNICAL_OVERVIEW_ARCHITECTURE.md](../../docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md).

## What this is

Real-time **Control Barrier Function (CBF)** quadratic program for a **single actuator**:

- Filters nominal acceleration `u_nom` → safe `u_safe`
- Enforces joint position barrier `q ≤ q_max`
- Respects actuator limits `[u_min, u_max]`
- Uses **OSQP** (warm-started) for low-latency loops (~1 kHz demo)

This is **edge/robotics control code**. It does **not** run on Netlify. Deploy target is a robot PC, industrial controller, or simulation host with C++ toolchain.

## Dependencies

- C++17 compiler (g++ / clang++)
- [Eigen3](https://eigen.tuxfamily.org/)
- [OSQP](https://osqp.org/) C API

### Ubuntu / Debian example

```bash
sudo apt update
sudo apt install -y g++ cmake libeigen3-dev
# Install OSQP from source or package, then:
```

### Build & run demo

```bash
cd edge/cbf
g++ -std=c++17 -O2 actuator_cbf_solver.cpp -I/usr/include/eigen3 -losqp -o actuator_cbf_demo
./actuator_cbf_demo
```

Link flags may vary (`-I` / `-L` for your OSQP install path).

## API sketch

```cpp
ActuatorCBFSolver::Params p;
p.gamma = 5.0;
p.q_max = 1.0;
p.u_min = -8.0;
p.u_max = 8.0;
ActuatorCBFSolver solver(p);
double u_safe = solver.solve(q, q_dot, u_nom);
```

On QP failure the solver returns `u_min` (emergency deceleration).

## Theory & Robustness

Full mathematical development (relative degree, HOCBF, robust variants, adaptive HOCBF, σ-modification, parameter drift, concurrent learning) is documented in:

**[HOCBF_THEORY_AND_ROBUSTNESS.md](./HOCBF_THEORY_AND_ROBUSTNESS.md)**

## Safety note

Research / prototype code. Validate on hardware with proper limits, watchdogs, and E-stop before any physical deployment.

## Repo map

| Path | Role |
|------|------|
| `actuator_cbf_solver.cpp` | Solver class + 1 kHz demo `main` |
| `HOCBF_THEORY_AND_ROBUSTNESS.md` | Theory, robust & adaptive extensions |
| This README | Build & context |
| Architecture doc | Product-level Vector 2 narrative |
