import { setupApplication } from "./server";
import { PORT } from "./config/config";

setupApplication().then((app) => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
