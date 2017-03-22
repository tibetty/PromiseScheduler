<h1>PromiseScheduler</h1>
<p>PromiseScheduler, a scheduler to run promises in batch mode per the max concurrency set when creating. You can simply submit all your promises at any time as you wish, then all the concurrent behavior will be controlled by it.</p>

<h1>Usage</h1>
<p>
// Initialization<br>
const PromiseScheduler = require('promise-scheduler');<br>
let scheduler = new PromiseScheduler(&lt;maxConcurrency&gt;);<br>
// When you want to submit a promise<br>
scheduler.submit(&lt;your promise function&gt;, &lt;your parameters in array&gt;, &lt;your then function&gt;, &lt;your catch function&lt;);
</p>
<h1>Dependency</h1>
No third party dependency, but of course need ES6 that features Promise.
<p></p>