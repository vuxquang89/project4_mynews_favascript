$(document).ready(function(){
    const API_TOKEN = "de225a9937c497742f8334f9972307ae";
    const TIME = "T00:00:00.00Z";

    getTopHeadline();
    var date = new Date();  //khởi tạo ngày giờ hiện tại
    date = date.toISOString(); //chuyển đổi thời gian về dạng ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
    var dateString = (date+"").substring(0, 10);
    $("#fdate").val(dateString);
    console.log(date);

    $("#search-news").on("click", function(){
        $("#div-background").removeClass("hidden-background");
        $("#div-background").addClass("show-background");
        $("#search-box").addClass("show-box-search");
    });

    $("#btnSearch").on("click", function(){        
        searchControl();
    });

    $("#i-search").on("click", function(){
        searchControl();
    });

    $("#close-box").on("click", function(){
        closeBox();
    })

    function searchControl(){

        var keyword = $("#fsearch").val();
        var date = $("#fdate").val();

        if(keyword.trim().length > 0){
            search(keyword, date);            
        }else{
            getTopHeadline();
        }
        closeBox();
    }

    //get bảng tin mới nhất
    function getTopHeadline(){
        showLoading("#loading", true);
        $("#main").empty();
        $.ajax({
            url: 'https://gnews.io/api/v4/top-headlines?token=' + API_TOKEN,
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                //console.log(data.articles[0].title);
                showData(data);
                showLoading("#loading", false);
            },
            error: function (e) {
                console.log(e.responseText);
                showLoading("#loading", false);
            }
            
        });
        
    }

    //tìm bảng tin với từ khóa
    function search(keyword, date){
        showLoading("#loading", true);  //hiển thị biểu tượng loading
        $("#main").empty(); //xóa các phần tử con của main
        var dateTime;
        if(date.trim().length > 0){
            dateTime = date;
        }else{
            dateTime = dateString;
        }
        dateTime += TIME;
        //get data từ server gnews về dưới dạng json
        //https://gnews.io/api/v4/top-headlines?topic=sports&token=API-Token
        //
        $.ajax({
            url: 'https://gnews.io/api/v4/search?q='+keyword+'&from='+dateTime+'&token=' + API_TOKEN,
            dataType: 'json',
            success: function (data) {  //nhận kết quả trả về từ server
                console.log(data);
                //console.log(data.articles[0].title);                
                showData(data);                   
                showLoading("#loading", false);
            },
            error: function (e) {   //trả về lỗi
                console.log(e.responseText);
                $("#main").append("<p>Do not results found for keyword <b>"+keyword+"</b></p>");
                showLoading("#loading", false);
            }
            
        });
    }

    // phân tích quả json từ server trả về
    function showData(data){
        $.each(data.articles, function(i, val){
            //console.log(i + " : " + val);
            var title, image, url, date, content;
            $.each(val, function(name, v){
                //console.log(name + " : " + v);
                if(name === "title"){
                    title = v;
                }
                if(name === "image"){
                    image = v;
                }
                if(name === "url"){
                    url = v;
                }
                if(name === "publishedAt"){
                    date = v;
                }
                if(name === "content"){
                    content = ellipsis(v, 150);
                }
            });
            addElement(image, url, title, date, content);
        });
    }

    //thêm thông tin vào khối
    function addElement(image, url, title, date, content){
        var divContent = "<div class='row-content'>";
            divContent  += "<div class='col-left'>";
            divContent  += "<image src='"+ image + "' alt='image'></image>";
            divContent  += "</div>";
            divContent  += "<div class='col-right'>";
            divContent  += "<a target='_blank' href='" + url + "' title='" + title +"'><b>" + title + "</b></a>";
            divContent  += "<p class='news-date'><em>"+date+"</em></p>";
            divContent  += "<p class='news-content'>"+content+"</p>";
            divContent  += "</div>";
            divContent  += "</div>";
        $("#main").append(divContent);
        
    }

    //giảm độ dài của chuỗi, thêm vào đoạn sau dấu '...'
    function ellipsis(text, size) {
        var len = text.length;
        if (len >= size) {  //nếu đọ dài chuỗi dài hơn giới hạn đặt ra
            var subString = text.substring(0, size-1);
            text = subString.substring(0, subString.lastIndexOf(' ')) + "...";  //cắt ngắn ở ranh giới từ cuối cùng của chuỗi, ngăn cách bỏi khaongr trắng
        }
        return text;
    };

    function showLoading(id, value) {
        console.log("Loading....");
        var val = value ? 'block' : 'none';
        $(id).css({"display" : val}); 
    }

    function closeBox(){
        $("#div-background").removeClass("show-background");
        $("#div-background").addClass("hidden-background");
        $("#search-box").removeClass("show-box-search");
    }
});