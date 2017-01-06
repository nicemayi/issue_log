<style>
    
</style>

<template>
    <div class="well well-lg panel-body">
        <div>
            <h4>
                This is a <b style="color: red;">{{issue_detail.issue_type}}</b> issue from client <b style="color: red;">{{issue_detail.client_id}}</b>, opened by <b style="color: red;">{{issue_detail.create_by}}</b> at <b style="color: red;">{{issue_detail.create_time}}</b>
            </h4>
        </div>
        <div>
            <h3>
                1. Description:
            </h3>
            <p>&nbsp&nbsp&nbsp&nbsp{{issue_detail.description}}</p>
        </div>
        <div v-if="issue_detail.barcodes.length > 0">
            <h3>
                2. Involved Patient Sample Barcodes:
            </h3>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" style="margin: 1% 2% 1% 2%;" v-for="barcode in issue_detail.barcodes">{{barcode}}</button>
            </div>
        </div>
        <div v-else><h3>2. No involved patient samples.</h3></div>
        <div>
            <div v-if="issue_detail.comments.length > 0">
                <h3>
                    3. Comments:
                </h3>
                <ul>
                    <li v-for="each_comment in issue_detail.comments">
                        <h4>
                            {{each_comment.commented_time}} updated by {{each_comment.commented_by}} :
                        </h4>
                        <p>{{each_comment.comment_content}}</p>
                    </li>
                </ul>
            </div>
            <div v-else>
                <h3>
                    3. Currently No Comments On This Issue.
                </h3>
            </div>
        </div>
        <hr/>
        <div v-if="issue_detail.is_closed == '0'">
            <div>
                <h3>
                    Add Update Actions:
                </h3>
                <div class="form-group">
                    <textarea
                        class="form-control"
                        rows="5">
                    </textarea>
                </div>
                <button type="submit" class="btn btn-default">Submit Updates</button>
            </div>
            <hr/>
            <div>
                <h3>Add Department / Send notifications</h3>
                <hr/>
                <div>
                    <div>
                        <el-form ref="form">
                            <el-form-item width="50%">
                                <el-select v-model="add_department_or_person" multiple placeholder="Select" style="width: 30%;">
                                    <el-option-group
                                        v-for="group in groups"
                                        :label="group.label">
                                        <el-option
                                            v-for="person in group.persons"
                                            :label="person.label"
                                            :value="person.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item style="float:left;">
                            <el-form-item>
                                <el-button type="default">Add Related Departments/Persons</el-button>
                            </el-form-item>
                        </el-form>
                        <el-button type="danger" style="float:right;">Close Issue?</el-button>
                    </div>
                </div>
            </div>
            <br>
            <br>
        </div>
        <hr class="seperate_relations"/>
        <div></div>
        <div>
            <h5>
                Related to the following departments:
            </h5>
            <span style="margin-right: 1%;" class="label label-info" v-for="each_department in issue_detail.departments">{{each_department}}</span>
        </div>
        <br/>
        <div>
            <h5>
                This issue has been notified to:
            </h5>
            <span style="margin-right: 1%;" class="label label-info" v-for="each_user in issue_detail.notifications">{{each_user}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['issue_detail'],
        beforeMount: function() {

        },
        mounted() {

        },
        data () {
            return {
                selected: null,
                options: ['foo','bar','baz'],
                send_to: "",
                add_department_or_person: "",
                links: [],
                state1: '',
                groups: [
                    {
                        label: "Groups",
                        persons: [
                            {
                                value: "lab",
                                label: "Lab"
                            },
                            {
                                value: "accessioning",
                                label: "Accessioning"
                            },
                            {
                                value: "billing",
                                label: "Billing"
                            },
                            {
                                value: "it",
                                label: "IT"
                            }
                        ]
                    },
                    {
                        label: "Lab",
                        persons: [
                            {
                                value: "zhe",
                                label: "Zhe Wang"
                            },
                            {
                                value: "wang",
                                label: "Tianhao Wang"
                            },
                            {
                                value: "ethan",
                                label: "Ethan Liu"
                            }
                        ]
                    },
                    {
                        label: "Accession",
                        persons: [
                            {
                                value: "marie",
                                label: "Marie"
                            },
                            {
                                value: "gary",
                                label: "Gary"
                            }
                        ]
                    }
                ],
            }
        },
        methods: {
            querySearch(queryString, cb) {
                var links = this.links;
                var results = queryString ? links.filter(this.createFilter(queryString)) : links;
                // call callback function to return suggestions
                cb(results);
            },
            createFilter(queryString) {
                return (link) => {
                    return (link.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                return [
                    { "value": "vue", "link": "https://github.com/vuejs/vue" },
                    { "value": "element", "link": "https://github.com/ElemeFE/element" },
                    { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" },
                    { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" },
                    { "value": "vuex", "link": "https://github.com/vuejs/vuex" },
                    { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" },
                    { "value": "babel", "link": "https://github.com/babel/babel" }
                ];
            },
            handleSelect(item) {
                console.log(item);
            }
        }
    }
</script>