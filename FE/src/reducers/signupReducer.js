const signupReducer = (state, action) => {
  switch (action.type) {
    case "set_input":
      return {
        ...state,
        formInputs: { ...state.formInputs, [action.field]: action.value },
      };
    case "set_form_error":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.value },
      };
    case "set_signup_error": //if request fails
      return {
        ...state,
        errors: { ...state.errors, signup: action.value },
        loading: false,
      };
    case "set_loading":
      return {
        ...state,
        loading: true,
        errors: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        },
      };
    case "reset":
      return {
        formInputs: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        },
        errors: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          signup: false,
        },
        loading: false,
      };
  }
};

export default signupReducer;
