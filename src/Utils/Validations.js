let usernameRegex = /^[a-zA-Z]{2,}$/;
let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
let productNameRegex = /^[a-zA-Z]{2,}$/;
let productPriceRegex = /^[0-9]{2,}$/;



export const usernameValidation = {
    pattern: {
        value: usernameRegex,
        message: "Name must contain only Latin letters and be at least 2 characters long.",
    },
    required: {
        value: true,
        message: "Username is required",
    }

}

export const emailValidation = {
    pattern: {
        value: emailRegex,
        message: "Please enter a valid email address (example: user@example.com).",
    },
    required: {
        value: true,
        message: "Email is required",
    }
}
export const passwordValidation = {
    pattern: {
        value: passwordRegex,
        message: "Password must be 8–16 characters long, include at least one number and one special character.",
    },
    required: {
        value: true,
        message: "Password is required",
    }
}

export const productNameValidation = {
    pattern: {
        value: productNameRegex,
        message: "Please enter a valid product name",
    },
    required: {
        value: true,
        message: "Product name is required",
    }
}

export const productPriceValidation = {
    pattern: {
        value: productPriceRegex,
        message: "Please enter a valid product price",
    },
    required: {
        value: true,
        message: "Product price is required",
    }
}

export const productSpecsValidation = {
    required: {
        value: true,
        message: "Product specs is required",
    }
}