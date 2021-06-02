<!--filename - eval_review_html.tpl-->
<section id="external_module_output" class="<{if isset($data['hide_table']) && $data['hide_table'] == '1'}>hidden<{/if}>">
    <table class="table">
        <thead class="thead-inverse">
            <tr>
                <th class="bg-primary"><{$l.test_case}></th>
                <th class="bg-primary"><{$l.result}></th>
            </tr>
        </thead>
    <{if is_array($data['detailReport'])}>
        <{foreach from=$data['detailReport'] item=value key=key}>
            <tr>
                <td><{$l.test_case}><{$key + 1}></td><td><{$value}></td>
            </tr>
        <{/foreach}>
    <{/if}>
    </table>
    <span id="ansStatus" ans="<{$answer_status}>"></span>
</section>