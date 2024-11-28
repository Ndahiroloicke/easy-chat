import images from "./images";

const slides = [
  {
    id: 1,
    title: "Spend your money smarter",
    description: "Get ready to have control over your money with Binexopay",
    image: images.onboard1,
  },
  {
    id: 2,
    title: "Keep your money safe",
    description:
      "Start using a safer way of keeping and accessing your money everywhere",
    image: images.onboard2,
  },
  {
    id: 3,
    title: "Easy to use",
    description:
      "BinexoPay brought you an easy to use application simplifying your transactions",
    image: images.onboard3,
  },
];

const Rwanda = {
  alpha2Code: "RW",
  alpha3Code: "RWA",
  callingCodes: ["250"],
  flags: {
    png: "https://flagcdn.com/w320/rw.png",
    svg: "https://flagcdn.com/rw.svg",
  },
  name: "Rwanda",
};

const transactions = [
  {
    id: 1,
    image: images.user,
    name: "Nelson Mandela",
    senderEmail:"test@example.com",
    action: "income",
    amount: 20000,
    time: new Date(),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 2,
    image: images.user,
    name: "Lucky Believe",
    senderEmail:"test@example.example",
    action: "income",
    amount: 20000,
    time: new Date(),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 3,
    image: images.user,
    name: "Nelson Mandela",
    senderEmail:"test@example.example",
    action: "sent",
    amount: 20000,
    time: new Date("2024-05-16T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 4,
    image: images.user,
    name: "Mugisha Yves",
    senderEmail:"test@example.example",
    action: "sent",
    amount: 20000,
    time: new Date("2024-04-10T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 5,
    image: images.user,
    name: "Prince",
    senderEmail:"test@example.example",
    action: "withdraw",
    amount: 20000,
    time: new Date("2024-05-16T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 6,
    image: images.user,
    name: "Nelson Mandela",
    senderEmail:"test@example.example",
    action: "sent",
    amount: 20000,
    time: new Date("2024-04-10T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 7,
    image: images.user,
    name: "Bella Blandine",
    senderEmail: "bella@bella.com",
    action: "sent",
    amount: 20000,
    time: new Date("2024-04-10T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 8,
    image: images.user,
    name: "Bella Blandine",
    senderEmail:"bella@bella.com",
    action: "withdraw",
    amount: 20000,
    time: new Date("2024-04-10T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 9,
    image: images.user,
    name: "Nelson Mandela",
    senderEmail: "nelson@nelson.com",
    action: "sent",
    amount: 20000,
    time: new Date("2024-05-16T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
  {
    id: 10,
    image: images.user,
    name: "Kelia ",
    senderEmail:"kelia@gmail.com",
    action: "sent",
    amount: 20000,
    time: new Date("2024-04-11T08:30:00"),
    reciever:"Lucky Believe",
    recieverEmail:"lucky@lucky.com",
    note:"Groccery and fruits payment"
  },
];

const notifications = [
  {
    id: 1,
    name: "Nelson Mandela",
    desc: "received 20,000 FRW",
    time: new Date(),
    type: "income",
    image: images.user,
  },
  {
    id: 2,
    name: "Security Updates!",
    desc: "Use two-factor authentication for extra security on your account.",
    time: new Date(),
    type: "update",
  },
  {
    id: 3,
    name: "Multiple Payments Support Update!",
    desc: "Now you can add multiple cards. Go to Account   Payment methods to add another payment. ",
    time: new Date("2024-04-12T08:30:00"),
    type: "update",
  },
  {
    id: 4,
    name: "Nelson Mandela",
    desc: "received 20,000 FRW",
    time: new Date("2024-04-11T08:30:00"),
    type: "income",
    image: images.user,
  },
  {
    id: 5,
    name: "Security Updates!",
    desc: "Use two-factor authentication for extra security on your account.",
    time: new Date("2024-04-11T08:30:00"),
    type: "update",
  },
  {
    id: 6,
    name: "Multiple Payments Support Update!",
    desc: "Now you can add multiple cards. Go to Account   Payment methods to add another payment. ",
    time: new Date("2024-04-11T08:30:00"),
    type: "update",
  },
  {
    id: 7,
    name: "Nelson Mandela",
    desc: "received 20,000 FRW",
    time: new Date("2024-04-10T08:30:00"),
    type: "withdraw",
    image: images.user,
  },
  {
    id: 8,
    name: "Security Updates!",
    desc: "Use two-factor authentication for extra security on your account.",
    time: new Date("2024-04-10T08:30:00"),
    type: "update",
  },
  {
    id: 9,
    name: "Multiple Payments Support Update!",
    desc: "Now you can add multiple cards. Go to Account   Payment methods to add another payment. ",
    time: new Date("2024-04-10T08:30:00"),
    type: "update",
  },
];

// all contacts data

const contacts = [
  {
    id: 1,
    username: "Nelson Mandela",
    email: "email@gmail.com",
    image: images.user,
    phone:"+250786697658",
  },
  {
    id: 2,
    username: "Lucky Believe",
    email: "test@gmail.com",
    image: images.user5,
    phone:"+250786697658"
  },
  {
    id: 3,
    username: "Nelson Mandela",
    email: "nelson@gmail.com",
    image: images.user1,
    phone:"+250786697658"
  },
  {
    id: 4,
    username: "Broony jr.",
    email: "broony@gmail.com",
    image: images.user2,
    phone:"+250786697658"
  },
  {
    id: 5,
    username: "Jabiro Christelle",
    email: "jabiro@gmail.com",
    image: images.user,
    phone:"+250786697658"
  },
  {
    id: 6,
    username: "Nelson Mandela",
    email: "email@gmail.com",
    image: images.user3,
    phone:"+250786697658"
  },
  {
    id: 7,
    username: "Teta Leilla",
    email: "teta@gmail.com",
    image: images.user4,
    phone:"+250786697658"
  },
  {
    id: 8,
    username: "M. Gisele",
    email: "gisele@gmail.com",
    image: images.user3,
    phone:"+250786697658"
  },
  {
    id: 10,
    username: "Nelson Mandela",
    email: "email@gmail.com",
    image: images.user,
    phone:"+250786697658"
  }
];

// payment methods

const paymentMethods = [
  { id:1,
    methodName:"mobile money",
    number:"250786543922",
    image:images.momo,
  },
  { id:2,
    methodName:"visa",
    number:"250786543922",
    image:images.visa,
  },
  { id:3,
    methodName:"mastercard",
    number:"250786543922",
    image:images.mastercard,
  }
]


const formatDays = (date: Date) => {
  const currentDate = new Date();
  const providedDate = new Date(date);

  if (
    providedDate.getDate() === currentDate.getDate() &&
    providedDate.getMonth() === currentDate.getMonth() &&
    providedDate.getFullYear() === currentDate.getFullYear()
  ) {
    return "Today";
  }

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (
    providedDate.getDate() === yesterday.getDate() &&
    providedDate.getMonth() === yesterday.getMonth() &&
    providedDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  } else return "Older";
};

export default {
  slides,
  Rwanda,
  transactions,
  formatDays,
  notifications,
  contacts,
  paymentMethods
};
