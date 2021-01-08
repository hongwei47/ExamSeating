// Parses the mxGraph XML file format
function read(graph, filename) {
    var req = mxUtils.load(filename);
    var root = req.getDocumentElement();
    var dec = new mxCodec(root.ownerDocument);

    dec.decode(root, graph.getModel());
};

function selectionChanged(graph) {
    var div = document.getElementById('properties');

    // Forces focusout in IE
    graph.container.focus();

    // Clears the DIV the non-DOM way
    div.innerHTML = '';

    // Gets the selection cell
    var cell = graph.getSelectionCell();

    if (cell == null) {
        mxUtils.writeln(div, 'Nothing selected.');
    } else {
        // Writes the title
        var center = document.createElement('center');

        mxUtils.writeln(center, 'cell id: ' + cell.id);
        if (stuIDArr[seatIDArr.indexOf(cell.id)] != "n") {
            mxUtils.writeln(center, "學號: " + cell.getValue() + "");
        }


        div.appendChild(center);
        mxUtils.br(div);

        //換位子模式
        if (window.editing == true && seatIDArr.indexOf(cell.id) != -1 && stuIDArr[seatIDArr.indexOf(cell.id)] != "n") {

            var moveto = prompt("將" + cell.value + "移動到:");

            //取消
            if (moveto == null) {
                //alert("cancel");
                graph.getSelectionModel().removeCell(cell);
            }
            //輸入不可換入的座位號碼
            else if (stuIDArr[seatIDArr.indexOf(moveto)] != "n") {
                alert("此座位不可用");
            } else {
                //alert("可換");
                changeSeat(cell.id, moveto);
            }
            stateAutoRefresh();

        }

    }
}

function stateAutoRefresh() {

    seatIDArr.forEach(function(seatID, index) {
        cell = graph.getModel().getCell(seatID);
        if (statusArr[index] == "0") {
            cell.setStyle("fillColor=#CFD2DE");
            cell.setValue(stuIDArr[index]);
        } else if (statusArr[index] == "1") {
            cell.setStyle("fillColor=#D1E1CB");
            cell.setValue(cell.id);
        } else if (statusArr[index] == "2") {
            cell.setStyle("fillColor=#F5BE8E");
            cell.setValue(cell.id);
        }
    })

    graph.refresh();
}
//顯示可換目標
function interChangeable(graph) {

    seatIDArr.forEach(function(seatID, index) {
        if (stuIDArr[index] == "n") {
            var cell = graph.getModel().getCell(seatID);
            cell.setStyle("fillColor=green");
            cell.setValue(cell.id);
        }

    })
    graph.refresh();
}

//換座位
function changeSeat(oldID, newID) {
    var oldIndex = seatIDArr.indexOf(oldID);
    var newIndex = seatIDArr.indexOf(newID);

    stuIDArr[newIndex] = stuIDArr[oldIndex];
    stuIDArr[oldIndex] = "n";
}

function editMode() {
    window.editing = true;
    document.getElementById("edit_message").innerText = "editMode";
    document.getElementById("edit_message").color = "blue";
    document.getElementById("graphContainer").style.borderColor = "blue";
    document.getElementById("editBtn").disabled = true;
    document.getElementById("cancelEditBtn").disabled = false;
    document.getElementById("finishEditBtn").disabled = false;

    var cell = graph.getSelectionCell();
    graph.getSelectionModel().removeCell(cell);
}

function cancelEdit() {
    window.editing = false;
    document.getElementById("edit_message").innerText = "viewMode ";
    document.getElementById("edit_message").color = "black";
    document.getElementById("graphContainer").style.borderColor = "black";
    document.getElementById("editBtn").disabled = false;
    document.getElementById("cancelEditBtn").disabled = true;
    document.getElementById("finishEditBtn").disabled = true;

    stuIDArr = backupStuID.slice();
    stateAutoRefresh();
}

function finishEdit() {
    window.editing = false;
    document.getElementById("edit_message").innerText = "viewMode ";
    backupStuID = stuIDArr.slice();

    newStr = stuIDArr.join(',');
    console.log(newStr);

    window.location.href = 'update.php?newStr=' + newStr;
}

function setInfobox() {
    document.getElementById("seatingid").innerHTML += seatingID;
    document.getElementById("examid").innerHTML += examID;

    var assigned_count = 0;
    var unassigned_count = 0;
    stuIDArr.forEach(function(stu, index) {
        if (stu == "n") {
            unassigned_count++;
        } else {
            assigned_count++;
        }
    })
    document.getElementById("state_assigned").innerHTML += "(" + assigned_count + ")";
    document.getElementById("state_unassigned").innerHTML += "(" + unassigned_count + ")";
}

function setAutoReload(value, change) {
    if (change) {
        window.clearTimeout(window.timeoutID);
    }
    if (value > 0) {
        window.timeoutID = window.setTimeout(function() { location.href = "main.php?autoReload=" + value }, value * 1000);
        document.getElementById("autoReloader").value = value;
        console.log(timeoutID);
    } else if (value == 0) {
        location.href = "main.php";
    }
}