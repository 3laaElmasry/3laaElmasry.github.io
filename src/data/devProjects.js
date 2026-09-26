export const devProjects = [
  {
    id: 'bulky',
    name: 'Bulky Book',
    description: {
      en: 'A full-stack bookstore with role-based access and an order-management dashboard.',
      ar: 'متجر كتب متكامل بصلاحيات حسب الدور ولوحة تحكم لإدارة الطلبات.',
    },
    stack: ['ASP.NET Core MVC', 'N-Tier', 'Repository / Unit of Work', 'Facebook Login'],
    github: 'https://github.com/3laaElmasry/Bulky',
    live: 'https://bulkybookstore.runasp.net',
  },
  {
    id: 'learnava',
    name: 'Learnava',
    description: {
      en: 'A course platform with auth, AJAX DataTables, and a responsive UI.',
      ar: 'منصة كورسات فيها تسجيل دخول، AJAX DataTables، وواجهة متجاوبة.',
    },
    stack: ['ASP.NET Core MVC', 'EF Core', 'Razor Pages'],
    github: 'https://github.com/3laaElmasry/Learnava',
    live: 'https://learnavaacademy.runasp.net',
  },
  {
    id: 'clinic',
    name: 'Clinic Manager',
    description: {
      en: 'A REST API for patients, doctors, and appointments with JWT auth.',
      ar: 'REST API للمرضى والأطباء والمواعيد بمصادقة JWT.',
    },
    stack: ['ASP.NET Core', '3-Tier', 'JWT', 'Swagger'],
    github: 'https://github.com/3laaElmasry/ClinicManager',
    live: null,
  },
  {
    id: 'threads',
    name: 'Threads',
    description: {
      en: 'A microblogging API for posts, comments, and users.',
      ar: 'API لمنصة تدوين مصغر للبوستات والتعليقات والمستخدمين.',
    },
    stack: ['ASP.NET Core', 'Clean Architecture', 'JWT', 'Swagger'],
    github: 'https://github.com/3laaElmasry/Threads',
    live: null,
  },
];
