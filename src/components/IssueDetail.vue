<style>
    
</style>

<template>
    <div class="well well-lg panel-body">
        <div>
            <h4>
                This is a <b style="color: red;">complain</b> issue from client <b style="color: red;">1003</b>, opened by <b style="color: red;">Zhe</b> at <b style="color: red;">2016-12:10 15:30:00</b>
            </h4>
        </div>
        <div>
            <h3>
                Description:
            </h3>
            <p>
                Mr. Karlov had been Russia’s ambassador to Turkey since July 2013, according to a biography on the website of the Russian Embassy.
                Born in Moscow in 1954, he started his diplomatic career in his early 20s after graduating from the Moscow State Institute of International Relations and the country’s diplomatic academy.
                Mr. Karlov previously served as the ambassador to North Korea. He was married and had a son. According to Russian news agencies, his wife fainted and was hospitalized after being informed of his death.
                Richard Moore, the British ambassador to Turkey, described Mr. Karlov in a tweet after the attack as soft-spoken, hospitable and professional.
            </p>
        </div>
        <div>
            <h3>
                Involved Patient Sample Barcodes:
            </h3>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
                <button type="button" class="btn btn-secondary" style="margin: 2% 2% 2% 2%;">1612011111</button>
            </div>
        </div>
        <div>
            <h3>
                Comments:
            </h3>
            <ul>
                <li>
                    <h4>
                        2016-12-10 18:00:00 updated by zhe :
                    </h4>
                    <p>
                        This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence.
                    </p>
                </li>
                <li>
                    <h4>
                        2016-12-10 18:00:00 updated by zhe :
                    </h4>
                    <p>
                        This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence.
                    </p>
                </li>
                <li>
                    <h4>
                        2016-12-10 18:00:00 updated by zhe :
                    </h4>
                    <p>
                        This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence. This problem is funny and this shoule be a very very very very long sentence.
                    </p>
                </li>
            </ul>
        </div>
        <hr/>
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
        <hr class="seperate_relations"/>
        <div></div>
        <div>
            <h5>
                Related to the following departments:
            </h5>
            <span class="label label-info">Assessioning</span>
            <span class="label label-success">Lab</span>
            <span class="label label-info">Assessioning</span>
            <span class="label label-success">Lab</span>
            <span class="label label-info">Assessioning</span>
            <span class="label label-success">Lab</span>
        </div>
        <br/>
        <div>
            <h5>
                This issue has been notified to:
            </h5>
            <span class="label label-info">Zhe</span>
            <span class="label label-success">Wang</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['issue_number'],
        mounted() {
            console.log("From component issuedetail: ", this.issue_number);
            this.links = this.loadAll();
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