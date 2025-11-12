// department.js — supports default + dynamically added departments

// Default departments (for first-time load)
const defaultDepartments = [
  {
    id: 1,
    name: "Health Department",
    head: "Dr. Anil Verma",
    contactPerson: "Priya Singh",
    phone: "1234567890",
    email: "health@example.com",
    address: "123 Health St, City",
    staffCount: 4,
    employees: [
      "Dr. Anil Verma",
      "Nurse Priya Singh",
      "Technician Ramesh Kumar",
      "Dr. Sunita Mehta",
    ],
  },
  {
    id: 2,
    name: "Education Department",
    head: "Arjun Rao",
    contactPerson: "Kavya Sharma",
    phone: "2345678901",
    email: "education@example.com",
    address: "456 Education Ave, City",
    staffCount: 4,
    employees: [
      "Teacher Arjun Rao",
      "Teacher Kavya Sharma",
      "Admin Anil Joshi",
      "Teacher Deepa Nair",
    ],
  },
  {
    id: 3,
    name: "Sanitation Department",
    head: "Mohan Kumar",
    contactPerson: "Sunita",
    phone: "3456789012",
    email: "sanitation@example.com",
    address: "789 Clean Rd, City",
    staffCount: 4,
    employees: ["Worker Ravi", "Worker Sunita", "Inspector Mohan", "Worker Rajesh"],
  },
  {
    id: 4,
    name: "Water Department",
    head: "Raj Kumar",
    contactPerson: "Priya",
    phone: "4567890123",
    email: "water@example.com",
    address: "101 Water St, City",
    staffCount: 4,
    employees: ["Engineer Raj", "Technician Priya", "Inspector Sunil", "Worker Nisha"],
  },
  {
    id: 5,
    name: "Infrastructure Department",
    head: "Rakesh",
    contactPerson: "Neha",
    phone: "5678901234",
    email: "infrastructure@example.com",
    address: "202 Build Ave, City",
    staffCount: 4,
    employees: ["Engineer Rakesh", "Architect Neha", "Worker Amit", "Supervisor Sanjay"],
  },
  {
    id: 6,
    name: "Transport Department",
    head: "Sunil",
    contactPerson: "Arjun",
    phone: "6789012345",
    email: "transport@example.com",
    address: "303 Transit Rd, City",
    staffCount: 4,
    employees: ["Driver Sunil", "Inspector Arjun", "Technician Kavya", "Worker Priya"],
  },
  {
    id: 7,
    name: "Electricity Department",
    head: "Mohan",
    contactPerson: "Ravi",
    phone: "7890123456",
    email: "electricity@example.com",
    address: "404 Power St, City",
    staffCount: 4,
    employees: ["Engineer Mohan", "Technician Ravi", "Worker Sunita", "Inspector Anil"],
  },
  {
    id: 8,
    name: "Fire Department",
    head: "Raj",
    contactPerson: "Kavya",
    phone: "8901234567",
    email: "fire@example.com",
    address: "505 Fire Rd, City",
    staffCount: 4,
    employees: ["Firefighter Raj", "Inspector Kavya", "Driver Sunil", "Worker Amit"],
  },
  {
    id: 9,
    name: "Parks & Recreation Department",
    head: "Priya",
    contactPerson: "Rajesh",
    phone: "9012345678",
    email: "parks@example.com",
    address: "606 Green Ln, City",
    staffCount: 4,
    employees: ["Gardener Priya", "Worker Rajesh", "Supervisor Sunil", "Inspector Kavya"],
  },
  {
    id: 10,
    name: "Revenue Department",
    head: "Ramesh",
    contactPerson: "Neha",
    phone: "0123456789",
    email: "revenue@example.com",
    address: "707 Revenue St, City",
    staffCount: 4,
    employees: ["Clerk Ramesh", "Inspector Neha", "Supervisor Amit", "Worker Sunita"],
  },
];

// ✅ Get departments (default + added ones)
export const getDepartments = () => {
  const stored = JSON.parse(localStorage.getItem("departments") || "[]");
  const all = [...defaultDepartments];
  stored.forEach((dept) => {
    const exists = all.some((d) => d.email === dept.email);
    if (!exists) all.push(dept);
  });
  return all;
};

// ✅ Add new department
export const addDepartment = (dept) => {
  const stored = JSON.parse(localStorage.getItem("departments") || "[]");
  const exists = stored.some((d) => d.email === dept.email);
  if (!exists) {
    stored.push(dept);
    localStorage.setItem("departments", JSON.stringify(stored));
  }
};

// ✅ Update department (edit)
export const updateDepartment = (updatedDept) => {
  const stored = JSON.parse(localStorage.getItem("departments") || "[]");
  const updated = stored.map((d) =>
    d.id === updatedDept.id ? { ...d, ...updatedDept } : d
  );
  localStorage.setItem("departments", JSON.stringify(updated));
};

// ✅ Delete department
export const deleteDepartment = (id) => {
  const stored = JSON.parse(localStorage.getItem("departments") || "[]");
  const filtered = stored.filter((d) => d.id !== id);
  localStorage.setItem("departments", JSON.stringify(filtered));
};

// ✅ Export combined departments
export const departments = getDepartments();
