const util = require("util");
const promisify = util.promisify;
const request = require("request");

const promisfiedRequest = promisify(request);

const sites = [
  "http://localhost:4000/public/urlTwo.txt",
  "http://localhost:4000/public/urlOne.txt"
];

const TOP_COUNT = 5;

const promises = sites.map(url => {
  return promisfiedRequest(url);
});

const getStatistics = (content, index) => {
  let count = {};
  let max = { link: "", occur: 0 };
  let urls = content.split("\n");
  urls.forEach(url => {
    count[url] = (count[url] || 0) + 1;
    if (count[url] > max.occur) {
      max.link = url;
      max.occur = count[url];
    }
  });

  const urlCounter = Object.keys(count).map(key => {
    return `${key},${count[key]}`;
  });

  let top = `${sites[index]}, max: ${max.link},${max.occur}`;

  // console.log(JSON.stringify({ top, stat }, null, 2));
  return {
    top,
    urlCounter
  };
};

Promise.all(promises)
  .then(results => {
    return Promise.all(results);
  })
  .then(data => {
    let repo = [];
    let tops = [];

    const contentList = data.map(item => item.body);

    const stat = contentList.map(getStatistics);

    stat.forEach(s => {
      repo = repo.concat(s.urlCounter);
      tops = tops.concat(s.top);
    });

    tops.forEach(t => console.log(`${t}`));

    const descendList = repo.sort((a, b) => {
      const [aLink, aOccur] = a.split(",");
      const [bLink, bOccur] = b.split(",");
      return parseInt(bOccur) - parseInt(aOccur);
    });

    descendList.slice(0, TOP_COUNT).forEach(item => {
      console.log(`top url: ${item}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
