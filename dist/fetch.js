(function () {
  var bookName = document.getElementById('name');
  var btn = document.getElementById('submit');
  btn.onclick = function () {
    fetch('searchbook?name=' + bookName.value)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      throw err;
    })
    .then(function (data) {
      document.getElementById('searchResult').innerHTML = '';
      data.books.forEach(function (ele, i) {
        document.getElementById('searchResult').innerHTML +=
        '<li>第' + (i + 1) + '本书:' + ele.title + '</li>';
      });
    });
  };
})();
