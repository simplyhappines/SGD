document.addEventListener('DOMContentLoaded', function() {
    initializeGrades(); // 确保有初始数据
    loadGrades();       // 加载数据到表格
    calculateAverage(); // 计算平均分
});

function initializeGrades() {
    if (!localStorage.getItem('grades')) {
        const initialGrades = [
            { name: "复变函数与积分变换", hours: 40, grade: 97 },
            { name: "模拟电子技术(二)", hours: 56, grade: 82 },
            { name: "数字电路与逻辑设计", hours: 56, grade: 84 },
            { name: "大学物理(二)", hours: 64, grade: 75 },
            { name: "离散数学", hours: 32, grade: 92 },
            { name: "数据科学基础", hours: 32, grade: 91 }
        ];
        localStorage.setItem('grades', JSON.stringify(initialGrades));
    }
}

function addOrUpdateGrade() {
    const name = document.getElementById('courseName').value.trim();
    const hours = parseInt(document.getElementById('courseHours').value, 10);
    const grade = parseInt(document.getElementById('courseGrade').value, 10);
    if (!name || hours <= 0 || grade < 0) return;

    const table = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    const existingRow = Array.from(table.rows).find(row => row.cells[0].textContent === name);

    if (existingRow) {
        existingRow.cells[1].textContent = hours;
        existingRow.cells[2].textContent = grade;
    } else {
        const row = table.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).textContent = hours;
        row.insertCell(2).textContent = grade;
        const deleteCell = row.insertCell(3);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.onclick = function() { deleteGrade(row.rowIndex); };
        deleteCell.appendChild(deleteButton);
    }

    calculateAverage();
    saveGrades();
    document.getElementById('gradeForm').reset();
}

function deleteGrade(index) {
    const table = document.getElementById('gradesTable');
    table.deleteRow(index);
    calculateAverage();
    saveGrades();
}

function calculateAverage() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].rows;
    let totalWeightedGrades = 0, totalHours = 0;

    Array.from(rows).forEach(row => {
        const hours = parseInt(row.cells[1].textContent, 10);
        const grade = parseInt(row.cells[2].textContent, 10);
        totalWeightedGrades += grade * hours;
        totalHours += hours;
    });

    const average = totalHours ? (totalWeightedGrades / totalHours).toFixed(2) : 0;
    document.getElementById('average').textContent = "加权平均分：" + average;
}

function saveGrades() {
    const rows = document.getElementById('gradesTable').getElementsByTagName('tbody')[0].rows;
    const grades = Array.from(rows).map(row => ({
        name: row.cells[0].textContent,
        hours: parseInt(row.cells[1].textContent),
        grade: parseInt(row.cells[2].textContent)
    }));
    localStorage.setItem('grades', JSON.stringify(grades));
}

function loadGrades() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const tbody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    grades.forEach(grade => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = grade.name;
        row.insertCell(1).textContent = grade.hours;
        row.insertCell(2).textContent = grade.grade;
        const deleteCell = row.insertCell(3);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.onclick = function() { deleteGrade(row.rowIndex); };
        deleteCell.appendChild(deleteButton);
    });
}