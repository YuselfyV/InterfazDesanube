var idBuscado = 0;


function cleanMessage() {
    $("#textMessage").val("");
    $("#cloud").val(0);
    $("#client").val(0);
}

function consultarMessage() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Message/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {
            $("#contenidoTablaMessage").empty();
            respose.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.messageText));
                row.append($("<td>").text(element.cloud.name));
                row.append($("<td>").text(element.client.name));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" data-bs-target="#updateMessageModal" data-bs-toggle="modal" onclick="buscarMessage(' + element.idMessage + ')">Editar</button>'));
                row.append($("<td class='text-center'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onclick="eliminarMessage(' + element.idMessage + ')">Eliminar</button>'));
                $("#contenidoTablaMessage").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


function cargarCloud() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Cloud/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {

            $(".cloud").each(function () {
                $(this).empty();
                $(this).append($("<option>").val(0).text("Select a Cloud"));

                respose.forEach(element => {
                    $(this).append($("<option>").val(element.id).text(element.name));
                });
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}

function cargarClient() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Client/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {

            $(".client").each(function () {
                $(this).empty();
                $(this).append($("<option>").val(0).text("Select a Client"));

                respose.forEach(element => {
                    $(this).append($("<option>").val(element.idClient).text(element.name));
                });
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


function crearMessage() {

    if($("#textMessage").val().length == 0 ){
        alert("All fields are required")
    }else{ 
    var textMessage = $("#textMessage").val();
    var cloud_id = $("#cloud").val();
    var client_id = $("#client").val();

    var data = {
        messageText: textMessage,
        cloud:{
            id: cloud_id
        },
        client:{
            idClient: client_id
        }
    };

    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Message/save",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                $("#textMessage").val("");
                $("#cloud").val(0);
                $("#client").val(0);
                alert("Successfully created!!");
                consultarMessage();
            },
            500: function () {
                alert("An error has occurred!!");
            }
        }
    });
}
}

function actualizarMessage(){
    var id = idBuscado;
    var textMessage = $("#textUpdateMessage").val();
    var cloud_id = $("#cloudUpdateMessage").val();
    var client_id = $("#clientUpdateMessage").val();
    

    var data = {
        idMessage:id,
        messageText:textMessage,
        cloud: {
            id: cloud_id
        },
        client: {
            idClient: client_id
        }
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Message/update",
        type:"PUT",
        dataType:"json",
        data:JSON.stringify(data), 
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                idBuscado = 0;
                $("#textUpdateMessage").val("");
                $("#cloudUpdateMessage").val(0);
                $("#clientUpdateMessage").val(0);
                consultarMessage();
            }
        }
    });
}


function eliminarMessage(id){
    var r = confirm("Are you sure to delete the message?");
    if (r == true) {
        var data = {
            idMessage:id
        };
      
        $.ajax({
            url:"https://desarrollonube.azurewebsites.net/api/Message/"+id,
            type:"DELETE",
            dataType:"json",
            data:JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function(){
                  
                    consultarMessage();
                }
            }
        });
    }
}



function buscarMessage(id){
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Message/"+id,
        type:"GET",
        dataType:"json",
        success: function (respose){
            if(respose.idMessage!=null){
                idBuscado = respose.idMessage;
                $("#textUpdateMessage").val(respose.messageText);
                $("#cloudUpdateMessage").val(respose.cloud.id);
                $("#clientUpdateMessage").val(respose.client.idClient);
            }else{
                alert("The record was not found!!");
            }
        },
        error: function(xhr,status){
            alert("An error has occurred!!");
        }
    });
}




$("#btnGuardarCloud").click(function(){
    var name = $("#nameCloud").val();
    var brand = $("#brandCloud").val();
    var year = $("#yearCloud").val();
    var description = $("#descriptionCloud").val();
    var data = {
        name:name,
        brand: brand,
        year:year,
        description:description
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Cloud/save",
        type:"POST",
        dataType:"json",
        data:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                
                $("#nameCloud").val("");
                $("#brandCloud").val("");
                $("#yearCloud").val("");
                $("#descriptionCloud").val("");
                cargarCloud();
            },
            500: function(){
                alert("An error has occurred!!");
            }
        }
    });
});



$("#btnGuardarClient").click(function(){
    var email = $("#emailClient").val();
    var password = $("#passwordClient").val();
    var name = $("#nameClient").val();
    var age = $("#ageClient").val();
    
    var data = {
        email:email,
        password:password,
        name:name,
        age:age
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Client/save",
        type:"POST",
        dataType:"json",
        data:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                
                $("#emailClient").val("");
                $("#passwordClient").val("");
                $("#nameClient").val("");
                $("#ageClient").val("");
                cargarClient();
            },
            500: function(){
                alert("An error has occurred!!");
            }
        }
    });
});

$(document).ready(function(){
   
    consultarMessage();
    cargarCloud();
    cargarClient();
});