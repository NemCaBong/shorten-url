import express, { Express, Response, Request } from "express";
import * as database from "./config/database";
import { ShortUrl } from "./models/shortUrl.model";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import * as utils from "./utils/utils";

dotenv.config();
const app: Express = express();

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect db
database.connect();

app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.get("/", async (req: Request, res: Response) => {
  const shortUrls = await ShortUrl.find({ deleted: false });
  res.render("index.pug", {
    shortUrls: shortUrls,
  });
});

app.post("/shortUrl", async (req: Request, res: Response) => {
  const { fullUrl, description } = req.body;

  if (utils.validateUrl(fullUrl)) {
    try {
      const short = nanoid(8);
      let url = await ShortUrl.findOne({
        full: fullUrl,
      });

      if (url) {
        console.log("Đã có url này rồi!");
      } else {
        url = new ShortUrl({
          full: fullUrl,
          short: short,
          description: description,
        });
        await url.save();
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Url không hợp lệ!");
  }
  return res.redirect("back");
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({
      short: req.params.shortUrl,
    });
    if (shortUrl == null) return res.sendStatus(403);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
  } catch (error) {
    console.log("Có lỗi xảy ra ", error.message);
    res.redirect("back");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port`);
});
