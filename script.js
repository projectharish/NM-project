// Employee Management System - JavaScript

// Initialize employee data array
let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Create particle background effect
function createParticles() {
    const particleCount = 50;
    const body = document.body;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(102, 126, 234, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            pointer-events: none;
            z-index: 0;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        body.appendChild(particle);
    }
    
    // Add keyframes for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Run particle creation on page load
createParticles();

// Chart instances
let departmentChart, salaryChart, roleChart, hoursChart;
let salaryDistributionChart, experienceChart, performanceSalaryChart;

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const employeeForm = document.getElementById('employee-form');
const employeeGrid = document.getElementById('employee-grid');
const searchInput = document.getElementById('search-input');
const filterDepartment = document.getElementById('filter-department');

// Tab Navigation
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to selected tab and content
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Update charts when switching to dashboard or analytics
        if (targetTab === 'dashboard' || targetTab === 'analytics') {
            updateAllCharts();
        }
        
        if (targetTab === 'employee-list') {
            displayEmployees(employees);
        }
    });
});

// Form Submission
employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const employee = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        position: document.getElementById('position').value,
        role: document.getElementById('role').value,
        department: document.getElementById('department').value,
        salary: parseFloat(document.getElementById('salary').value),
        workHours: parseInt(document.getElementById('workHours').value),
        startDate: document.getElementById('startDate').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        performance: parseInt(document.getElementById('performance').value)
    };
    
    employees.push(employee);
    saveToLocalStorage();
    
    // Reset form and show success message
    employeeForm.reset();
    
    // Create a success notification
    const notification = document.createElement('div');
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Employee added successfully!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // Update dashboard
    updateDashboard();
});

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Display Employees
function displayEmployees(employeesToShow) {
    employeeGrid.innerHTML = '';
    
    if (employeesToShow.length === 0) {
        employeeGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No employees found. Add some employees to get started!</p>';
        return;
    }
    
    employeesToShow.forEach(emp => {
        const card = createEmployeeCard(emp);
        employeeGrid.appendChild(card);
    });
}

// Create Employee Card
function createEmployeeCard(emp) {
    const card = document.createElement('div');
    card.className = 'employee-card';
    
    const initials = `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`;
    const yearsExperience = calculateExperience(emp.startDate);
    
    card.innerHTML = `
        <button class="delete-btn" onclick="deleteEmployee(${emp.id})"><i class="fas fa-times"></i></button>
        <div class="employee-header">
            <div class="employee-avatar">${initials}</div>
            <div class="employee-name">
                <h3>${emp.firstName} ${emp.lastName}</h3>
                <p><i class="fas fa-briefcase"></i> ${emp.position} | <i class="fas fa-building"></i> ${emp.department}</p>
            </div>
        </div>
        <div class="employee-details">
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-envelope"></i> Email:</span>
                <span class="detail-value">${emp.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-phone"></i> Phone:</span>
                <span class="detail-value">${emp.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-id-badge"></i> Role:</span>
                <span class="detail-value">${emp.role}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-rupee-sign"></i> Salary:</span>
                <span class="detail-value">₹${emp.salary.toLocaleString()}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-clock"></i> Work Hours:</span>
                <span class="detail-value">${emp.workHours} hrs/week</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-calendar-alt"></i> Experience:</span>
                <span class="detail-value">${yearsExperience} years</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-star"></i> Performance:</span>
                <span class="performance-badge">${emp.performance}/10 <i class="fas fa-trophy"></i></span>
            </div>
            ${emp.skills.length > 0 ? `
                <div class="detail-row" style="flex-direction: column; margin-top: 10px;">
                    <span class="detail-label"><i class="fas fa-tools"></i> Skills:</span>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px;">
                        ${emp.skills.map(skill => `<span style="background: rgba(102, 126, 234, 0.2); padding: 3px 8px; border-radius: 4px; font-size: 0.8rem;"><i class="fas fa-check"></i> ${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Calculate Years of Experience
function calculateExperience(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
        return years - 1;
    }
    return years;
}

// Delete Employee
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveToLocalStorage();
        displayEmployees(employees);
        updateDashboard();
    }
}

// Search and Filter
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm)
    );
    displayEmployees(filtered);
});

filterDepartment.addEventListener('change', (e) => {
    const dept = e.target.value;
    if (dept) {
        const filtered = employees.filter(emp => emp.department === dept);
        displayEmployees(filtered);
    } else {
        displayEmployees(employees);
    }
});

// Update Dashboard Statistics
function updateDashboard() {
    const totalEmployees = employees.length;
    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const departments = [...new Set(employees.map(emp => emp.department))];
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    
    document.getElementById('total-employees').textContent = totalEmployees;
    document.getElementById('total-salary').textContent = `₹${totalSalary.toLocaleString()}`;
    document.getElementById('total-departments').textContent = departments.length;
    document.getElementById('avg-salary').textContent = `₹${Math.round(avgSalary).toLocaleString()}`;
}

// Update All Charts
function updateAllCharts() {
    updateDepartmentChart();
    updateSalaryChart();
    updateRoleChart();
    updateHoursChart();
    updateAnalyticsCharts();
}

// Department Distribution Chart
function updateDepartmentChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    const deptCount = {};
    
    employees.forEach(emp => {
        deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
    });
    
    const labels = Object.keys(deptCount);
    const data = Object.values(deptCount);
    const colors = generateColors(labels.length);
    
    if (departmentChart) departmentChart.destroy();
    
    departmentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Salary by Department Chart
function updateSalaryChart() {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    const deptSalaries = {};
    const deptCount = {};
    
    employees.forEach(emp => {
        if (!deptSalaries[emp.department]) {
            deptSalaries[emp.department] = 0;
            deptCount[emp.department] = 0;
        }
        deptSalaries[emp.department] += emp.salary;
        deptCount[emp.department]++;
    });
    
    const labels = Object.keys(deptSalaries);
    const data = labels.map(dept => Math.round(deptSalaries[dept] / deptCount[dept]));
    const colors = generateColors(labels.length);
    
    if (salaryChart) salaryChart.destroy();
    
    salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Salary ($)',
                data: data,
                backgroundColor: colors,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        },
                        callback: value => '₹' + value.toLocaleString()
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Role Distribution Chart
function updateRoleChart() {
    const ctx = document.getElementById('roleChart').getContext('2d');
    const roleCount = {};
    
    employees.forEach(emp => {
        roleCount[emp.role] = (roleCount[emp.role] || 0) + 1;
    });
    
    const labels = Object.keys(roleCount);
    const data = Object.values(roleCount);
    const colors = generateColors(labels.length);
    
    if (roleChart) roleChart.destroy();
    
    roleChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Work Hours Chart
function updateHoursChart() {
    const ctx = document.getElementById('hoursChart').getContext('2d');
    const hoursRanges = {
        '1-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0
    };
    
    employees.forEach(emp => {
        if (emp.workHours <= 20) hoursRanges['1-20']++;
        else if (emp.workHours <= 30) hoursRanges['21-30']++;
        else if (emp.workHours <= 40) hoursRanges['31-40']++;
        else if (emp.workHours <= 50) hoursRanges['41-50']++;
        else hoursRanges['51-60']++;
    });
    
    const labels = Object.keys(hoursRanges);
    const data = Object.values(hoursRanges);
    
    if (hoursChart) hoursChart.destroy();
    
    hoursChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Employees',
                data: data,
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: '#667eea',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Analytics Charts
function updateAnalyticsCharts() {
    updateTopPerformers();
    updateSalaryDistributionChart();
    updateExperienceChart();
    updatePerformanceSalaryChart();
}

// Top Performers
function updateTopPerformers() {
    const sorted = [...employees].sort((a, b) => b.performance - a.performance).slice(0, 5);
    const container = document.getElementById('top-performers');
    
    if (sorted.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No employees yet</p>';
        return;
    }
    
    container.innerHTML = sorted.map((emp, index) => `
        <div class="performer-item">
            <div>
                <strong><i class="fas fa-user"></i> ${emp.firstName} ${emp.lastName}</strong>
                <div style="font-size: 0.85rem; color: #888;"><i class="fas fa-briefcase"></i> ${emp.position} | <i class="fas fa-building"></i> ${emp.department}</div>
            </div>
            <div class="performer-rank">#${index + 1} - ${emp.performance}/10 <i class="fas fa-star"></i></div>
        </div>
    `).join('');
}

// Salary Distribution Chart
function updateSalaryDistributionChart() {
    const ctx = document.getElementById('salaryDistributionChart').getContext('2d');
    const ranges = {
        '< ₹50k': 0,
        '₹50k-₹75k': 0,
        '₹75k-₹100k': 0,
        '₹100k-₹150k': 0,
        '> ₹150k': 0
    };
    
    employees.forEach(emp => {
        if (emp.salary < 50000) ranges['< ₹50k']++;
        else if (emp.salary < 75000) ranges['₹50k-₹75k']++;
        else if (emp.salary < 100000) ranges['₹75k-₹100k']++;
        else if (emp.salary < 150000) ranges['₹100k-₹150k']++;
        else ranges['> ₹150k']++;
    });
    
    const labels = Object.keys(ranges);
    const data = Object.values(ranges);
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
    
    if (salaryDistributionChart) salaryDistributionChart.destroy();
    
    salaryDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// Experience Level Chart
function updateExperienceChart() {
    const ctx = document.getElementById('experienceChart').getContext('2d');
    const levels = {
        'Intern (0-1yr)': 0,
        'Junior (1-3yrs)': 0,
        'Mid (3-5yrs)': 0,
        'Senior (5-10yrs)': 0,
        'Expert (10+yrs)': 0
    };
    
    employees.forEach(emp => {
        const exp = calculateExperience(emp.startDate);
        if (exp <= 1) levels['Intern (0-1yr)']++;
        else if (exp <= 3) levels['Junior (1-3yrs)']++;
        else if (exp <= 5) levels['Mid (3-5yrs)']++;
        else if (exp <= 10) levels['Senior (5-10yrs)']++;
        else levels['Expert (10+yrs)']++;
    });
    
    const labels = Object.keys(levels);
    const data = Object.values(levels);
    const colors = ['#a29bfe', '#fd79a8', '#fdcb6e', '#00b894', '#0984e3'];
    
    if (experienceChart) experienceChart.destroy();
    
    experienceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Employees',
                data: data,
                backgroundColor: colors,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 9
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Performance vs Salary Scatter Chart
function updatePerformanceSalaryChart() {
    const ctx = document.getElementById('performanceSalaryChart').getContext('2d');
    
    const data = employees.map(emp => ({
        x: emp.performance,
        y: emp.salary / 1000, // Convert to thousands for better visualization
        name: `${emp.firstName} ${emp.lastName}`
    }));
    
    if (performanceSalaryChart) performanceSalaryChart.destroy();
    
    performanceSalaryChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Employees',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                pointRadius: 6,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return `${point.name}: ₹${point.y}k, Rating: ${point.x}/10`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        },
                        callback: value => '₹' + value + 'k'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Salary (thousands)',
                        color: '#888',
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    min: 0,
                    max: 10,
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 10
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Performance Rating',
                        color: '#888',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Generate Vibrant Colors
function generateColors(count) {
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(250, 112, 154, 0.8)',
        'rgba(254, 225, 64, 0.8)',
        'rgba(0, 242, 254, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(255, 107, 107, 0.8)',
        'rgba(72, 219, 251, 0.8)'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

// Initialize the application
function init() {
    updateDashboard();
    displayEmployees(employees);
    
    // If there are employees, update charts
    if (employees.length > 0) {
        updateAllCharts();
    }
}

// Run initialization
init();
