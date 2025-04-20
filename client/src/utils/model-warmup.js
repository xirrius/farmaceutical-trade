export const wakeModel = async () => {
  try {
    console.log("waking the model up...");

    await fetch("https://medicine-recommender-model.onrender.com/ping", {
      method: "GET",
    });
    console.log("Model pinged!");
  } catch (err) {
    console.error("Warm-up failed:", err);
  }
};