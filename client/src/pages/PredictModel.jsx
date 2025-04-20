import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { wakeModel } from "../utils/model-warmup";

// async function wakeModel() {
//   try {
//     console.log("waking model up...");

//     const res = await fetch(
//       "https://medicine-recommender-model.onrender.com/predict",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           type: "animal",
//           region: "Punjab",
//           animal: "Poultry",
//           age_group: "Chick",
//           symptom: "Diarrhea",
//           disease: "Coccidiosis",
//         }),
//       }
//     );

//     const data = await res.json();
//     console.log("Model warm-up response:", data);
//   } catch (err) {
//     console.warn("Model warm-up failed:", err.message);
//   }
// }


const PredictModel = () => {
    const [result, setResult] = useState(null);

    useEffect(() => {
      wakeModel();
    }, []);
    
    const {
      control,
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm({
      defaultValues: {
        type: "crop", // or whatever default
        region: "",
        crop: "",
        season: "",
        animal: "",
        age_group: "",
        symptom: "",
        disease: "",
      },
      shouldUnregister: true,
    });
    const selectedType = watch("type");

    const { t } = useTranslation();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        if (values.disease === "") {
          delete values.disease;
        }
        console.log(values);
        const res = await axiosInstance.post(
          "/predict",
          values
        );
        console.log(res);

        setResult(res.data);
    }
    
  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.log("Form has errors", formErrors); // 👈 debug error reason
        })}
        className="flex flex-col gap-2 p-4 mt-12"
      >
        <h1 className="font-bold">{t("Get Medicine Recommendation")}</h1>

        {/* Type selection */}
        <Controller
          name="type"
          control={control}
          //   defaultValue={formData.type}
          rules={{ required: t("Type is required") }}
          render={({ field }) => (
            <Select
              label={t("Type")}
              variant="bordered"
              selectedKeys={new Set([field.value])}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0]);
              }}
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
            >
              <SelectItem key="crop">{t("Crop")}</SelectItem>
              <SelectItem key="animal">{t("Animal")}</SelectItem>
            </Select>
          )}
        />

        {/* Region input */}
        <Input
          label={t("Region")}
          type="text"
          placeholder=""
          //   defaultValue={formData.region}
          variant="bordered"
          {...register("region", { required: t("Region is required") })}
          isInvalid={!!errors.region}
          errorMessage={errors.region?.message}
        />

        {/* Crop or Animal and Season or Age Group */}

        <div style={{ display: selectedType === "crop" ? "block" : "none" }}>
          {selectedType === "crop" && (
            <Controller
              name="crop"
              control={control}
              rules={{ required: t("Crop is required") }}
              render={({ field }) => (
                <Input
                  className="mb-2"
                  {...field}
                  label={t("Crop")}
                  variant="bordered"
                  isInvalid={!!errors.crop}
                  errorMessage={errors.crop?.message}
                />
              )}
            />
          )}
          {selectedType === "crop" && (
            <Controller
              name="season"
              control={control}
              rules={{ required: t("Season is required") }}
              render={({ field }) => (
                <Input
                  {...field}
                  label={t("Season")}
                  variant="bordered"
                  isInvalid={!!errors.season}
                  errorMessage={errors.season?.message}
                />
              )}
            />
          )}
        </div>

        <div style={{ display: selectedType === "animal" ? "block" : "none" }}>
          {selectedType === "animal" && (
            <Controller
              name="animal"
              control={control}
              rules={{ required: t("Animal is required") }}
              render={({ field }) => (
                <Input
                  className="mb-2"
                  {...field}
                  label={t("Animal")}
                  variant="bordered"
                  isInvalid={!!errors.animal}
                  errorMessage={errors.animal?.message}
                />
              )}
            />
          )}
          {selectedType === "animal" && (
            <Controller
              name="age_group"
              control={control}
              rules={{ required: t("Age Group is required") }}
              render={({ field }) => (
                <Input
                  {...field}
                  label={t("Age Group")}
                  variant="bordered"
                  isInvalid={!!errors.age_group}
                  errorMessage={errors.age_group?.message}
                />
              )}
            />
          )}
        </div>

        {/* Symptom input */}
        <Input
          label={t("Symptom")}
          type="text"
          placeholder=""
          //   defaultValue={formData.symptom}
          variant="bordered"
          {...register("symptom", { required: t("Symptom is required") })}
          isInvalid={!!errors.symptom}
          errorMessage={errors.symptom?.message}
        />

        {/* Disease input */}
        <Input
          label={t("Disease (if known)")}
          type="text"
          placeholder=""
          //   defaultValue={formData.disease}
          variant="bordered"
          {...register("disease")}
          isInvalid={!!errors.disease}
          errorMessage={errors.disease?.message}
        />

        {/* Submit Button */}
        <div className="pt-5 flex justify-end gap-4">
          <Button color="primary" type="submit">
            {t("Get Recommendation")}
          </Button>
          <Button color="danger" variant="light" onClick={() => navigate(-1)}>
            {t("Cancel")}
          </Button>
        </div>
      </form>
      {result && (
        <div className="mt-6 mb-6 p-4 border rounded-lg shadow bg-gray-50">
          <div className="flex justify-between">
            <h2 className="font-bold text-lg mb-2">
              {t("Recommendation Result")}
            </h2>
            <Button
              isIconOnly
              onClick={() => setResult(null)}
              variant="light"
              className="mt-[-0.5rem] mr-[-0.5rem]"
            >
              <X size={16} />
            </Button>
          </div>

          <p>
            <strong>{t("Medicine")}:</strong> {result.recommendation.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
export default PredictModel