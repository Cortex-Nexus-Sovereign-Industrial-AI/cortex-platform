<template>
  <div id="app" class="dashboard">
    <header class="navbar">
      <div class="navbar-brand">
        <h1>📱 Social Media Dashboard</h1>
        <p>CINIS NEXUS Multi-Platform Automation</p>
      </div>
      <nav class="navbar-menu">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/composer" class="nav-link">Compose</router-link>
        <router-link to="/analytics" class="nav-link">Analytics</router-link>
        <router-link to="/accounts" class="nav-link">Accounts</router-link>
      </nav>
      <button @click="logout" class="btn-logout">Logout</button>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="dashboard-footer">
      <p>&copy; 2026 CINIS NEXUS INDUSTRY OGOJA | Powered by Cortex Platform</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 2px solid #4f46e5;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.navbar-brand h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #818cf8;
}

.navbar-brand p {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0.25rem 0 0 0;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #4f46e5;
  color: #fff;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-footer {
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid #334155;
  padding: 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
