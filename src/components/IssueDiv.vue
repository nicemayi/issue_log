<style>

</style>

<template>
    <div class="border-right border-bottom border-left">
        <ul class="list-group">
            <issue-list v-for="issue in issues" :issue="issue"><issue-list>
        </ul>
    </div>
</template>

<script>
    import IssueList from './IssueList';
    import { mapGetters } from 'vuex';
    export default {
        components: {IssueList},
        data() {
            return {

            }
        },
        methods: {

        },
        computed: {
            ...mapGetters({
                issues: 'get_issues'
            })
        },
    }
</script>