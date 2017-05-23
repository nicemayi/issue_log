<style>

</style>

<template>
    <div class="border-right border-bottom border-left">
        <ul class="list-group">
            <issue-list v-for="issue in issues_prop" :issue="issue"></issue-list>
        </ul>
    </div>
</template>

<script>
    import IssueList from './IssueList';
    import { mapGetters } from 'vuex';
    export default {
        props: ["issues_prop"],
        components: {IssueList},
        data() {
            return {

            }
        },
        methods: {

        },
        // computed: {
        //     ...mapGetters({
        //         issues: 'get_issues'
        //     })
        // },
    }
</script>