import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL_CAT = "https://cat-fact.herokuapp.com";
const API_URL_IMG = "https://api.thecatapi.com";

function getDate() {
  var today = new Date();

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var month = months[today.getMonth()];

  var date = today.getDate();
  var formattedDate = date < 10 ? "0" + date : date;

  var year = today.getFullYear();

  var output = month + " " + formattedDate + " " + year;

  return output;
}

const date = getDate();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    context: "Let's Find Out...",
    text: "-",
    date: "-",
    imageUrl: "",
    showCard: false,
  });
});

app.get("/get-fact", async (req, res) => {
  try {
    const result_fact = await axios.get(
      `${API_URL_CAT}/facts/random?animal_type=cat&amount=1`
    );
    const result_img = await axios.get(`${API_URL_IMG}/v1/images/search`);

    res.render("index.ejs", {
      context: "Another fact?",
      text: JSON.stringify(result_fact.data.text),
      date: date,
      imageUrl: result_img.data[0].url,
      showCard: true,
    });
    console.log(result_fact.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
