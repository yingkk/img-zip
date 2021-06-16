$(function () {
  $(".upload").click(function () {
    document.getElementById("file").click();
  });

  $("#clear").click(function (e) {
    e.stopPropagation();
    $("#img").attr("src", null);
    $("#clear").hide();
    $("#file").val = "";
  });
});

function handleChange(files) {
  const file = files[0];
  const fileSize = file?.size;
  console.log("before zip size", fileSize);
  const limitSize = 2 * 1024 * 1024; //2M
  fileSize > limitSize ? zipImg(file) : getBase64(file);
}

function zipImg(file) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let img = new Image();
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  img.onload = function () {
    const originW = this.width;
    const originH = this.height;

    // 最大尺寸限制
    //   let maxWidth = 400,
    //       maxHeight = 400;
    let targetW = originW;
    let targetH = originH;

    // 图片尺寸超过400x400的限制
    //   if (originWidth > maxWidth || originHeight > maxHeight) {
    //     if (originWidth / originHeight > maxWidth / maxHeight) {
    //       // 更宽，按照宽度限定尺寸
    //       targetWidth = maxWidth;
    //       targetHeight = Math.round(maxWidth * (originHeight / originWidth));
    //     } else {
    //       targetHeight = maxHeight;
    //       targetWidth = Math.round(maxHeight * (originWidth / originHeight));
    //     }
    //   }

    //缩放尺寸
    targetW = Math.round(targetW / 3);
    targetH = Math.round(targetH / 3);

    // canvas对图片进行缩放
    canvas.width = targetW;
    canvas.height = targetH;
    // 清除画布
    context.clearRect(0, 0, targetW, targetH);
    // 图片压缩
    context.drawImage(img, 0, 0, targetW, targetH);
    canvas.toBlob(function (blob) {
      console.log("after zip size", blob.size);
      if (blob.size > 1024 * 1024 * 5) {
        input.value = "";
        alert("图片压缩后大于5M，请重新上传");
        return false;
      }
      zipUrl = URL.createObjectURL(blob);
      //回显
      showClear(zipUrl);
    }, file.type || "image/png");
  };
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    let base64 = e.target.result;
    showClear(base64);
  };
}

function showClear(val) {
  $("#img").attr("src", val);
  $("#clear").show();
}
