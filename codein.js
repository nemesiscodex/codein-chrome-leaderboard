/**
Copyright (c) 2015 Julio Daniel Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var students = {};

function toArray(){
    var arr = [];
    for(var id in students){
        if(students.hasOwnProperty(id)){
            arr.push(students[id]);
        }
    }
    return arr;
}

function printTop10(){
    var studentArray = toArray();
    var showTasks = true;
    if(!console.groupCollapsed || !console.groupEnd) {
        showTasks = false;
    }
    studentArray.sort(function(s1, s2){
        return s2.count - s1.count;
    })

    if(showTasks)
        console.groupCollapsed("Leaderboard");
    for(var i = 0; i < 10 && i < studentArray.length; i++){
        var student = studentArray[i];
        var studentScore = (i + 1) + ") " + student.display_name + ": " +
                            student.count+ " tasks.";
        if(showTasks){

            console.groupCollapsed(studentScore);
            for(var j = 0; j < student.task_completed.length; j++){
                var task = student.task_completed[j];
                console.log(task.name);
            }
            console.groupEnd();
        }else{
            console.info(studentScore);
        }
    }
    if(showTasks)
        console.groupEnd();

}

function fetchData(){
    var PAGE_SIZE = 3000;
    var STATUS_COMPLETE = 7;
    $.ajax({
        method: "GET",
        url: "api/program/2015/taskinstance/",
        data: {
            my_tasks: false,
            order: "-modified",
            page: 1,
            page_size: PAGE_SIZE,
            status: STATUS_COMPLETE
        }
    }).done(function(response){
        var count = response.count;
        var results = response.results;
        var task;
        if(results != null){
            for(var i = 0; i < results.length; i++){
                task = results[i];
                if(students[task.claimed_by_id]){
                    students[task.claimed_by_id].task_completed.push(task.task_definition);
                    students[task.claimed_by_id].count += 1;
                }else{
                    students[task.claimed_by_id] = task.claimed_by;
                    students[task.claimed_by_id].count = 1;
                    students[task.claimed_by_id].task_completed = [ task.task_definition ];
                }
            }
        }

        printTop10();

    }).fail(function(){
        console.error("Could not fetch data.");
    });
}

$(document).ready(function(){
    console.info("Loading Leaderboard");
    fetchData();
});
