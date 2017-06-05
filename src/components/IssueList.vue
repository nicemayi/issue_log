<style>

</style>

<template>
    <li class="list-group-item">
        <div class="panel panel-default">
        
        <div class="issue-detail panel-heading">
            <div>
                <span :class="isClosed">&nbsp</span>
                <span class="label label-default">{{issue.issue_number}}</span>
                <a  @click="changeShowMe">&nbsp <b>{{issue.title}}</b></a>
                <span v-for="(value, key) in departments" ><div v-bind:class="value?'label label-default':'label label-danger'" >{{key}} </div>&nbsp</span>
                <button @click="changeShowMe" type="button" class="btn btn-primary btn-xs badge-btn">Comments &nbsp <span class="badge">{{issue.comments.length}}</span></button>
            </div>
            <div style="margin-top: 5px;">
                <span style="color: gray">This issue is created by {{issue.create_by}} {{issue_create_related_time}}; {{issue_last_update_related_time_str}}</span>
            </div>
        </div>
            <issue-detail v-if="showMe" :issue_detail="issue" @closeMe="showMe=false">
            </issue-detail>
        </div>
    </li>
</template>
<script>
    import IssueDetail from './IssueDetail';
    import moment from 'moment-timezone';


    export default {
        components: {IssueDetail},
        props: ['issue'],
        mounted() {

        },
        computed: {
            // Arrow function cant use 'this' ???
            isClosed: function() {
                return this.issue.is_closed == '1' ? "glyphicon glyphicon-lock" : "glyphicon glyphicon-flag"
            },
            issue_create_related_time: function() {
                // console.log(this.issue.create_time)
                return moment(this.issue.create_time).fromNow();
            },
            issue_last_update_related_time_str: function() {
                if (this.issue.comments.length > 0) {
                    let nearest_comment = this.issue.comments[0];
                    let commented_time = this.issue.comments[0].commented_time;
                    let commented_time_str = moment(commented_time).fromNow();
                    let commented_by = this.issue.comments[0].commented_by;
                    let return_str = `Last update is from ${commented_by} ${commented_time_str}.`;
                    return return_str;
                } else {
                    return "No comments have been added on this issue yet.";
                }
            },
            departments: function() {
                let department = {};
                this.issue.departments.forEach( (c) => {
                    department[c] = false;
                })
                this.issue.comments.forEach( (c) => {
                    if (c.comment_type == 'DEPARTMENT_CLOSE') {
                        department[c.comment_from_department] = true;
                    }
                })
                return department;
            }
        },
        data() {
            return {
                showMe: false
            }
        },
        methods: {
            changeShowMe() {
                this.showMe = !this.showMe;
            },
            createFilter(queryString) {
                return (link) => {
                    return (link.value.indexOf(queryString.toLowerCase()) === 0);
                };
            }
        }
    }
</script>
