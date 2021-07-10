const fetch = require("node-fetch");

const urls = [
  "http://localhost:4000/public/urlTwo.txt",
  "http://localhost:4000/public/urlOne.txt"
];

const run = async urls => {
  let occurList = [];
  let repo = [];
  for (const url of urls) {
    let response = await fetch(url);
    let body = await response.text();
    let count = {};
    let max = { link: "", occur: 0 };
    let lines = body.split("\n");
    lines.forEach(url => {
      count[url] = (count[url] || 0) + 1;
      if (count[url] > max.occur) {
        max.link = url;
        max.occur = count[url];
      }
    });
    occurList.push(`${url}, max: ${max.link},${max.occur}`);
    repo = repo.concat(
      Object.keys(count).map(url => `${url},${count[url]}`)
    );
  }
  occurList.forEach(mx => {
    console.log(`${mx}`);
  });

  let sortedList = repo.sort((a, b) => {
    const [aLink, aCount] = a.split(",");
    const [bLink, bCount] = b.split(",");
    return parseInt(bCount) - parseInt(aCount);
  });

  sortedList.slice(0, 5).forEach(item => {
    console.log(`top url: ${item}`);
  });
};

run(urls);
