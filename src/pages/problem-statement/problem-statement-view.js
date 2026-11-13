/* Problem statement screen markup: the research and product context, moved off Today.
   These are supplied research figures and quotes, not live telemetry or the rep's own results. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Screen: Problem statement ============ -->
   <div id="viewProblem" hidden>
    <header class="page-head">
      <p class="eyebrow">Research &amp; product context</p>
      <h1 id="problemTitle" tabindex="-1">Problem statement</h1>
      <p class="page-sub">The problem, the hypothesis, and the voice of the rep.</p>
    </header>

    <section class="ps-hypothesis" aria-labelledby="psHypTitle">
      <div class="ps-signal"><b>18%</b><span>use the CRM today</span></div>
      <div class="ps-body">
        <h2 id="psHypTitle">Hypothesis B — do the work here</h2>
        <p>Letting reps call or email right from the task will keep them in the CRM, so they log as they go — instead of doing the work in email and on the phone, then logging it after.</p>
        <blockquote class="ps-feedback">
          <p>“Reps asked to do the work here, not log it after.”</p>
          <cite>— From real swap feedback, Module 2</cite>
        </blockquote>
        <p class="ps-instruction">Work this follow-up as you normally would.</p>
      </div>
    </section>

    <section class="ps-metrics" aria-label="Research metrics from the Context Data Pack">
      <div class="ps-metric"><b>18%</b><span>Weekly active adoption across licensed seats</span></div>
      <div class="ps-metric"><b>8</b><span>Required fields to log a single deal update</span></div>
      <div class="ps-metric"><b>11 <small>min</small></b><span>Average task time for “update a deal”, vs. a 2-min target</span></div>
      <div class="ps-metric"><b>63%</b><span>Of reps keep a shadow spreadsheet alongside the CRM</span></div>
    </section>

    <section class="ps-quotes" aria-labelledby="psQuotesTitle">
      <div class="ps-quotes-head"><h2 id="psQuotesTitle">What reps told us</h2><span>Real quotes · Context Data Pack</span></div>
      <div class="ps-quote-list">
        <blockquote><p>“Logging activity feels like data entry for management, not something that helps me sell.”</p><cite>— Senior AE</cite></blockquote>
        <blockquote><p>“If it could just tell me who to call next, I’d open it every morning.”</p><cite>— SDR, occasional user</cite></blockquote>
        <blockquote><p>“It’s faster to keep my deals in a spreadsheet than to fight the CRM’s eight required fields.”</p><cite>— Account exec, 2 logins / month</cite></blockquote>
      </div>
    </section>
   </div><!-- /viewProblem -->
`);
