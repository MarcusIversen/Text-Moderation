import {setupApplication} from "./server";
import {CONNECTION_STRING, HF_ACCESS_TOKEN, PORT} from "./config/config";

  setupApplication().then((app) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })


