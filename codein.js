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

    studentArray.sort(function(s1, s2){
        return s2.count - s1.count;
    })

    for(var i = 0; i < 10 && i < studentArray.length; i++){
        var student = studentArray[i];
        console.info((i + 1) + ") " + student.display_name + ": " + student.count+ " tasks.");
    }

}

function fetchData(){
    var PAGE_SIZE = 1000;
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
