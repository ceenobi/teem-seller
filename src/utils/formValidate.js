const validateFields = {
  email: {
    required: "Email is required!",
    validate: {
      maxLength: (v) =>
        v.length <= 50 || "The email should have at most 50 characters",
      matchPattern: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Invalid email",
    },
  },
  merchantEmail: {
    required: "Merchant Email is required",
    validate: {
      maxLength: (v) =>
        v.length <= 50 || "The email should have at most 50 characters",
      matchPattern: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Invalid email",
    },
  },
  password: {
    required: "Password is required!",
    validate: {
      minLength: (v) =>
        v.length >= 6 || "Password should not be less than 5 characters",
    },
  },
  confirmPassword: {
    required: "Password is required!",
    validate: {
      minLength: (v) =>
        v.length >= 6 || "Password should not be less than 5 characters",
    },
  },
  currentPassword: {
    required: "Please enter your current password",
    validate: {
      minLength: (v) =>
        v.length >= 6 || "Password should not be less than 5 characters",
    },
  },
  username: {
    required: "Username is required!",
    validate: {
      minLength: (v) =>
        v.length >= 3 || "Username should have at least 3 characters",
      matchPattern: (v) =>
        /^[a-zA-Z0-9_]+$/.test(v) ||
        "Username must contain only letters, numbers and _",
    },
  },
  merchantName: {
    required: "Your merchant name is required",
    validate: {
      minLength: (v) => v.length >= 3 || "At least 3 characters is required",
    },
  },
  currency: {
    required: "Please select an option",
  },
  state: {
    required: "Please select an option",
  },
  description: {
    required: "Please tell us a bit more",
  },
  city: {
    required: "This field is required",
  },
  country: {
    required: "This field is required",
  },
  zip: {
    required: "This field is required",
  },
  street: {
    required: "This field is required",
  },
  standardRate: {
    required: "This field is required",
  },
  discountCode: {
    required: "Discount code is required",
  },
  discountValue: {
    required: "Please enter a discount value",
  },
  name: {
    required: "Please enter a name",
  },
  slug: {
    required: "This field is required",
  },
  image: {
    required: "This field is required",
  },
  price: {
    required: "Set a price for your product",
  },
  amount: {
    required: "Set a price for your product",
  },
  category: {
    required: "Give your product a category",
  },
};

export default validateFields;
