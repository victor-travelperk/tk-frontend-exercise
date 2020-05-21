import * as Yup from "yup"

export const RecipeSchema = Yup.object().shape({
  name: Yup.string().max(50, "Maximum 50 characters").required("Required"),
  description: Yup.string()
    .max(250, "Maximum 250 characters")
    .required("Required"),
  ingredients: Yup.array().of(Yup.string()).min(1, "At least one ingredient is required"),
})
