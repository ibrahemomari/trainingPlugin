let addItem = document.getElementById("addItem");
addItem.addEventListener("click", (e) => {
  Items.search(
    {
      filter: {
        $or: [{ "$json.Subtitle": "test2" }],
      },
      // sort: { rank: 1, lastName: -1 },
      // fields: ["rank", "lastName"],
      // skip: 20,
      // limit: 10,
    },
    (err, res) => {
      err ? console.error(err) : console.log(res);
    }
  );
});

Items.load((err, res) => {
  if (err) console.error(err);
  else if (res && res.length > 0) {
    document.getElementById("empty-state").style.display = "none";
    Items.ui_create(
      "tbody",
      document.getElementById("items-table"),
      `
        ${res
        .map((el) => {
          return `
          <tr>
          <td><div class="img-holder aspect-1-1"><img src="${el.data.listImage}" alt=""></div></td>
          <td>${el.data.title}</td>
          <td>${el.data.Subtitle}</td>
          <td class="text-center">${el.data.createdOn}</td>
          <td>
                        <div class="pull-right">
                            <button class="btn bf-btn-icon" id="${el.id}" onclick="helpershowSubPage('${el.id}')"><span class="icon icon-pencil"></span></button>
                            <button class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
                        </div>
                    </td>
          </tr>
          `;
        })
        .join("")}
        
        `,
      ["tableBody"]
    );
  } else {
    document.getElementById("items-table").style.display = "none";
  }
});

let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", (e) => {
  Items.searchFilter(searchInput.value, (err, res) => {
    if (err) console.error(err);
    else if (res) {
      var tbl = document.getElementById("items-table"); // Get the table

      if (tbl.getElementsByTagName("tbody").length > 0) {
        tbl.removeChild(tbl.getElementsByTagName("tbody")[0]); // Remove first instance of body‏
      }
      if (res.length == 0) return;
      Items.ui_create(
        "tbody",
        document.getElementById("items-table"),
        `
        ${res
          .map((el) => {
            return `
          <tr>
          <td><div class="img-holder aspect-1-1"><img src="${el.listImage}" alt=""></div></td>
          <td>${el.data.title}</td>
          <td>${el.data.Subtitle}</td>
          <td class="text-center">${el.data.createdOn}</td>
          <td>
                        <div class="pull-right">
                            <button class="btn bf-btn-icon"><span class="icon icon-pencil"></span></button>
                            <button class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
                        </div>
                    </td>
          </tr>
          `;
          })
          .join("")}
        
        `
      );
    }
  });
});

let titleSort = document.getElementById("titleSort");
titleSort.addEventListener("click", (e) => {
  let sort = null;
  if (titleSort.childNodes[1]) {
    let el = titleSort.childNodes[1];
    if (el.classList.contains("icon-chevron-down")) {
      sort = -1;
      el.classList.remove("icon-chevron-down");
      el.classList.add("icon-chevron-up");
    } else {
      el.classList.remove("icon-chevron-up");
      el.classList.add("icon-chevron-down");
      sort = 1;
    }
  }
  Items.searchSort(sort, (err, res) => {
    if (err) console.error(err);
    else if (res) {
      var tbl = document.getElementById("items-table"); // Get the table
      if (tbl.getElementsByTagName("tbody")) {
        tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
      }
      Items.ui_create(
        "tbody",
        document.getElementById("items-table"),
        `
        ${res
          .map((el) => {
            return `
          <tr>
          <td><div class="img-holder aspect-1-1"><img src="${el.listImage}" alt=""></div></td>
          <td>${el.data.title}</td>
          <td>${el.data.Subtitle}</td>
          <td class="text-center">${el.data.createdOn}</td>
          <td>
                        <div class="pull-right">
                            <button class="btn bf-btn-icon"><span class="icon icon-pencil"></span></button>
                            <button class="btn bf-btn-icon"><span class="icon icon-cross2"></span></button>
                        </div>
                    </td>
          </tr>
          `;
          })
          .join("")}
        
        `
      );
    }
  });
});

const croppedImage = (imgUrl) => {
  let croppedImg = buildfire.imageLib.cropImage(imgUrl, {
    size: "600px",
    aspect: "1:1",
  });
  console.log("Cropped image url", croppedImg);
  return croppedImg;
};

const saveItem = () => {
  let newItem = {
      title: document.getElementById('title').value, 
      Subtitle: document.getElementById('subtitle').value,
      listImage: thumbnail.imageUrl,
      coverImage: thumbnail2.imageUrl,
      description: tinymce.activeEditor.getContent()
  }
  console.log(newItem);

  Items.insert(newItem,(err,res)=>{
      if(err) console.error(err);
      else console.log(res);
  })
}

const showSubPage = (item) => {
  console.log("show function",  item)
  document.getElementById('mainPage').style.display = 'none';
  document.getElementById('subPage').style.display = 'block';
}


function helpershowSubPage(id) {
  console.log(id + " id");
  Items.getById(id, (err, res) => {
    if (err) console.log(err)
    console.log(res.data + "inside showSub");
    showSubPage(res);
  })
}