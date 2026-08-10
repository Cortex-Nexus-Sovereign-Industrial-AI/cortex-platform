/**
 * Cortex AI Nexus — Edge Kinetic Safety
 * Real-time Control Barrier Function (CBF) QP Solver for a single actuator.
 *
 * Dependencies: Eigen3, OSQP
 * Build: see edge/cbf/README.md
 *
 * Spec alignment: docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md (Vector 2)
 */

#include <iostream>
#include <vector>
#include <Eigen/Dense>
#include <osqp/osqp.h>

/**
 * @brief Real-time Control Barrier Function (CBF) QP Solver for a single actuator.
 */
class ActuatorCBFSolver {
public:
    struct Params {
        double gamma = 10.0;       // CBF class-K gain
        double q_max = 1.57;       // Joint position upper limit [rad]
        double u_min = -10.0;      // Max deceleration [rad/s^2]
        double u_max = 10.0;       // Max acceleration [rad/s^2]
    };

    ActuatorCBFSolver(const Params& params) : params_(params) {
        initOSQP();
    }

    ~ActuatorCBFSolver() {
        if (work_) osqp_cleanup(work_);
        if (data_) {
            if (data_->P) c_free(data_->P);
            if (data_->A) c_free(data_->A);
            c_free(data_);
        }
        if (settings_) c_free(settings_);
    }

    /**
     * @brief Solves the CBF-QP to filter nominal control input u_nom.
     * @param q Current position [rad]
     * @param q_dot Current velocity [rad/s]
     * @param u_nom Nominal desired acceleration [rad/s^2]
     * @return Safe acceleration u_safe [rad/s^2]
     */
    double solve(double q, double q_dot, double u_nom) {
        // Cost: minimize 0.5*(u - u_nom)^2  =>  q_cost = -u_nom
        q_cost_[0] = -u_nom;

        // Relative degree 2: h = q_max - q
        // CBF: u <= gamma * h - q_dot
        double h = params_.q_max - q;
        double cbf_ub = params_.gamma * h - q_dot;

        l_bounds_[0] = params_.u_min;
        l_bounds_[1] = -1e20;

        u_bounds_[0] = params_.u_max;
        u_bounds_[1] = cbf_ub;

        osqp_update_lin_cost(work_, q_cost_.data());
        osqp_update_bounds(work_, l_bounds_.data(), u_bounds_.data());

        osqp_solve(work_);

        if (work_->info->status_val == OSQP_SOLVED) {
            return work_->solution->x[0];
        } else {
            std::cerr << "[CBF Warning] QP Unsolved, applying emergency braking!" << std::endl;
            return params_.u_min;
        }
    }

private:
    Params params_;

    OSQPSettings* settings_ = nullptr;
    OSQPData*     data_     = nullptr;
    OSQPWorkspace* work_    = nullptr;

    std::vector<c_float> q_cost_   = {0.0};
    std::vector<c_float> l_bounds_ = {0.0, 0.0};
    std::vector<c_float> u_bounds_ = {0.0, 0.0};

    void initOSQP() {
        data_ = (OSQPData*)c_malloc(sizeof(OSQPData));
        settings_ = (OSQPSettings*)c_malloc(sizeof(OSQPSettings));

        if (settings_) {
            osqp_set_default_settings(settings_);
            settings_->verbose = false;
            settings_->warm_start = true;
            settings_->polish = false;
        }

        data_->n = 1;
        data_->m = 2;

        c_float p_val[1] = {1.0};
        c_int   p_i[1]   = {0};
        c_int   p_p[2]   = {0, 1};
        data_->P = csc_matrix(data_->n, data_->n, 1, p_val, p_i, p_p);

        c_float a_val[2] = {1.0, 1.0};
        c_int   a_i[2]   = {0, 1};
        c_int   a_p[2]   = {0, 2};
        data_->A = csc_matrix(data_->m, data_->n, 2, a_val, a_i, a_p);

        data_->q = q_cost_.data();
        data_->l = l_bounds_.data();
        data_->u = u_bounds_.data();

        osqp_setup(&work_, data_, settings_);
    }
};

int main() {
    ActuatorCBFSolver::Params params;
    params.gamma = 5.0;
    params.q_max = 1.0;
    params.u_min = -8.0;
    params.u_max = 8.0;

    ActuatorCBFSolver cbf_solver(params);

    double q = 0.95;
    double q_dot = 0.5;
    double dt = 0.001;

    std::cout << "--- Cortex AI Nexus | Real-Time CBF Filter ---" << std::endl;

    for (int step = 0; step < 5; ++step) {
        double u_nom = 5.0;
        double u_safe = cbf_solver.solve(q, q_dot, u_nom);

        std::cout << "Step " << step << " | State q: " << q
                  << " | u_nom: " << u_nom
                  << " -> u_safe: " << u_safe << std::endl;

        q_dot += u_safe * dt;
        q += q_dot * dt;
    }

    return 0;
}
