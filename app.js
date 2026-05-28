const app = document.querySelector("#formApp");
const stageNodes = Array.from(document.querySelectorAll(".stage"));
const LENDER_SHEET_ID = "1yZ2-YDj9DkzV58KFbCFTlXUZ_FfXbQS176eLg7veOKw";
const LENDER_SHEET_NAME = "Lender";
const AFFILIATE_SHEET_NAME = "Affiliates";
const SHEET_GVIZ_URL = `https://docs.google.com/spreadsheets/d/${LENDER_SHEET_ID}/gviz/tq`;
const MATCHING_API_URL = "https://script.google.com/macros/s/AKfycbx45hGl20uEYkovcSnjuliEJ8F1Il5H5tBGA20NYIasIOpbBOR5fZ4m8RaoDveQe6sd/exec";
const ROUND_ROBIN_STORAGE_KEY = "reig_lender_round_robin_v1";
const FALLBACK_LENDER_CSV = `,Lender Name,Logo Link,Website,Phone Number,States,Loan Types,Property Type,Usage,Loan Amounts,Credit Score,Benefit 1,Benefit 2,Benefit 3
0,Total Quality Lending,https://cdn.prod.website-files.com/68f2562a53d10311928fa320/694af3999500f0c29facab21_362e500234aa12dc699490cf58af4fbb083479de.png,https://www.totalqualitylending.com/,(800) 304-1925,"TX, TN, GA, SC, NC, VA, FL, AL, AZ, CA, CO, CT, GA, ID, IL, IN, IA, MI, MN, OH, OK, OR, WA, WI","Purchase, Refi, Cash-Out","Single Family, Condominium, Multi-Family: 2-4 Units, Multi-Family: 5+ Units","Long-term rental, Short-term rental, Fix & flip / rehab, Vacant / holding, Owner-occupied","$100k-$250k, $250k-$500k, $500k-$1M, $1M+","Excellent (720+), Good (680-719)",Built for investors,Flexible underwriting,Fast closing options
1,MMC Lending,https://mmclending.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffuj7ezwe%2Fproduction%2F661d2253a56a895ccdf9112cb94d68c81643befc-2000x766.png%3Fw%3D560%26q%3D85%26fit%3Dmax%26auto%3Dformat&w=384&q=75,mmclending.com,(844) 613-0824,"AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY","Purchase, Refi, Cash-Out","Single Family, Condominium, Multi-Family: 2-4 Units, Multi-Family: 5+ Units","Long-term rental, Short-term rental, Fix & flip / rehab, Vacant / holding","$100k-$250k, $250k-$500k, $500k-$1M, $1M+","Excellent (720+), Good (680-719), Average (620-679)","Fast, reliable pre-approvals","Experienced, responsive lending team",Investor-focused loan options
2,Salute Mortgage,https://salutemortgage.com/wp-content/uploads/2025/06/SM-Logo.png,salutemortgage.com,(888) 994-7781,"MN, WY, CO, KS, MO, TX, OK, LA, FL, GA, TN, AR","Purchase, Refi, Cash-Out","Single Family, Condominium, Multi-Family: 2-4 Units, Multi-Family: 5+ Units","Long-term rental, Short-term rental, Fix & flip / rehab, Vacant / holding, Owner-occupied","$100k-$250k, $250k-$500k, $500k-$1M, $1M+","Excellent (720+), Good (680-719), Average (620-679)",Get a loan program built around your unique needs and goals.,Veteran-Owned Expertise,"Guidance, transparency, and care that continues well beyond closing."`;
const FALLBACK_AFFILIATE_CSV = `,Affiliate Name,When to show,CTA,Logo Link,Affiliate Link,Benefit 1,Benefit 2,Benefit 3
0,Tend,show when they are purchasing,Cover My Purchase,https://mytend.com/hubfs/Tend_Stacked_Lockup_Prussian%20Blue.png,https://tend.pxf.io/c/5407987/1963816/23979,Avoid costly home surprises,Protect your purchase from day one,Get help when things break
1,Steadily,show anytime it isn't owner occupied,Protect My Rental Property,https://mms.businesswire.com/media/20211116005646/en/927610/5/steadily3.jpg?download=1,reinvestorguide.steadilypartner.com,Insurance built for landlords,Cover rental income risks,Protect against tenant damage
2,TurboTenant,show when they are purchasing a rental,Find Qualified Tenants,https://mma.prnewswire.com/media/1029119/TT__Logo.jpg?p=facebook,https://turbotenant.pxf.io/c/5407987/1424633/16969,Fill vacancies faster,Screen tenants before signing,Manage rentals without headaches
3,Kovo,Show for bad/poor credit,Start Building Credit,https://app.ashbyhq.com/api/images/org-theme-wordmark/54a37936-50e8-413e-b406-470cb4ef6ea6/c94755e6-f9df-4aec-b683-246206178914/acac8d44-80f1-48ea-b704-d0089b89a1a9.png,https://kovo-credit.sjv.io/c/5407987/886960/12274,Build credit without debt,Turn bills into credit progress,Improve approval odds over time
4,Vola Finance,Show for bad/poor credit,Get Cash Before Payday,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtY7VUDgMYfe_Um2EMWrisJ5q-VJwOrXXl8A&s,https://volafinance.pxf.io/c/5407987/2185416/28095,Cover gaps before payday,Avoid overdraft fees,Get cash when money's tight
5,Figure,show if they select cash out or refi,Unlock My Home Equity,https://mms.businesswire.com/media/20241022786544/en/2279039/22/Logo_Purple_w_bg.jpg,https://figure-home-equity.pxf.io/en19EX,Access equity without selling,Fund your next investment,Unlock cash from your property
6,Legal Zoom,Show for any non owner occupied,Start Your LLC,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMKZEB1_mR-HS-nPDj-V2jIbKGGltS-yx0Ig&s,http://legalzoom.com/?irgwc=1&afsrc=1&irclickid=SzTVoHzWTxyZREixAWV%3A7T3rUku1IH0mU2Tyws0&sharedid=&irpid=5407987&utm_medium=affiliate&utm_campaign=My%20Perfect%20Mortgage&ir_partnerid=5407987&ir_adid=2110096&ir_campaignid=26746,Separate personal and rental risk,Start your LLC correctly,Protect yourself as an investor`;

const steps = [
  {
    id: "deal",
    stage: "deal",
    stageLabel: "Deal",
    title: "What are you trying to do?",
    helper: "We'll use this to find the right loan structure.",
    answerKey: "deal",
    layout: "stack",
    choices: [
      {
        value: "Purchase",
        label: "&#127974; Purchase",
        detail: "Buying a new investment property"
      },
      {
        value: "Refinance",
        label: "&#128257; Refinance",
        detail: "Changing terms on a property you own"
      },
      {
        value: "Cash-out",
        label: "&#128181; Cash-out",
        detail: "Pulling equity from a property you own"
      }
    ]
  },
  {
    id: "hasRealtor",
    stage: "deal",
    stageLabel: "Deal",
    title: "Working with a Realtor?",
    helper: "",
    answerKey: "hasRealtor",
    condition: (answers) => answers.deal === "Purchase",
    choices: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" }
    ]
  },
  {
    id: "realtorMatch",
    stage: "deal",
    stageLabel: "Deal",
    title: "Want an investor-friendly Realtor?",
    helper: "Optional.",
    answerKey: "realtorMatch",
    condition: (answers) => answers.deal === "Purchase" && answers.hasRealtor === "No",
    choices: [
      { value: "Yes, match me", label: "Yes, match me" },
      { value: "No thanks", label: "No thanks" }
    ]
  },
  {
    id: "propertyType",
    stage: "property",
    stageLabel: "Property",
    title: "Property type?",
    helper: "Pick one.",
    answerKey: "propertyType",
    choices: [
      { value: "Single Family", label: "Single Family" },
      { value: "Condominium", label: "Condominium" },
      { value: "Multi-Family: 2-4 Units", label: "Multi-Family: 2-4 Units" },
      { value: "Multi-Family: 5+ Units", label: "Multi-Family: 5+ Units" },
      { value: "Mixed-use", label: "Mixed-use" },
      { value: "Retail Building", label: "Retail Building" }
    ]
  },
  {
    id: "timeline",
    stage: "property",
    stageLabel: "Property",
    title: "Where are you now?",
    helper: "Pick one.",
    answerKey: "timeline",
    choices: [
      { value: "Under contract", label: "Under contract" },
      { value: "Making offers", label: "Making offers" },
      { value: "Comparing financing", label: "Comparing financing" },
      { value: "Planning ahead", label: "Planning ahead" }
    ]
  },
  {
    id: "propertyValue",
    stage: "numbers",
    stageLabel: "Numbers",
    title: "Property value?",
    helper: "Estimate is fine.",
    answerKey: "propertyValue",
    choices: [
      { value: "Under $150k", label: "Under $150k" },
      { value: "$150k-$300k", label: "$150k-$300k" },
      { value: "$300k-$600k", label: "$300k-$600k" },
      { value: "$600k-$1M", label: "$600k-$1M" },
      { value: "$1M+", label: "$1M+" },
      { value: "Not sure", label: "Not sure" }
    ]
  },
  {
    id: "loanAmount",
    stage: "numbers",
    stageLabel: "Numbers",
    title: "Loan amount needed?",
    helper: "Estimate is fine.",
    answerKey: "loanAmount",
    choices: [
      { value: "Under $100k", label: "Under $100k" },
      { value: "$100k-$250k", label: "$100k-$250k" },
      { value: "$250k-$500k", label: "$250k-$500k" },
      { value: "$500k-$1M", label: "$500k-$1M" },
      { value: "$1M+", label: "$1M+" },
      { value: "Not sure", label: "Not sure" }
    ]
  },
  {
    id: "occupancy",
    stage: "numbers",
    stageLabel: "Numbers",
    title: "How will this property be used?",
    helper: "",
    answerKey: "occupancy",
    layout: "stack",
    choices: [
      {
        value: "Long-term rental",
        label: "&#127968;&#65039; Long-term rental",
        detail: "Leased to tenants (6+ months)"
      },
      {
        value: "Short-term rental",
        label: "&#127965;&#65039; Short-term rental",
        detail: "Airbnb, VRBO, vacation rental"
      },
      {
        value: "Fix & flip / rehab",
        label: "&#128296; Fix & flip / rehab",
        detail: "Buy, improve, and sell"
      },
      {
        value: "Owner-occupied",
        label: "&#127968; Owner-occupied",
        detail: "You'll live in part or all of it"
      },
      {
        value: "Vacant / holding",
        label: "&#128230; Vacant / holding",
        detail: "Not yet rented or in transition"
      }
    ]
  },
  {
    id: "creditRange",
    stage: "numbers",
    stageLabel: "Numbers",
    title: "Current credit score?",
    helper: "Estimate is fine. No SSN.",
    answerKey: "creditRange",
    choices: [
      { value: "Excellent (720+)", label: "Excellent (720+)" },
      { value: "Good (680-719)", label: "Good (680-719)" },
      { value: "Average (620-679)", label: "Average (620-679)" },
      { value: "Poor (below 620)", label: "Poor (below 620)" }
    ]
  },
  {
    id: "zip",
    stage: "numbers",
    stageLabel: "Numbers",
    title: "Property ZIP?",
    helper: "Used for lender availability.",
    type: "zip",
    answerKey: "zip"
  },
  {
    id: "unlock",
    stage: "you",
    stageLabel: "You",
    title: "Your best-matched lender is ready.",
    helper: "Enter your info to get the match and next step.",
    type: "unlock"
  }
];

const stageOrder = ["deal", "property", "numbers", "you"];
const state = {
  currentStep: 0,
  answers: {},
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consent: false
  },
  lenders: null,
  affiliates: null,
  lenderMatch: null,
  affiliateMatches: null,
  lenderSource: "",
  affiliateSource: "",
  started: false,
  completed: false,
  matchTimer: null
};

function track(eventName, details = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...details });
  console.info("[REIG form event]", eventName, details);
}

function render() {
  if (state.completed) {
    renderSuccess();
    updateProgress("you");
    return;
  }

  const step = steps[state.currentStep];
  updateProgress(step.stage);
  track("form_step_view", { step_id: step.id, stage: step.stage });

  if (step.type === "zip") {
    renderZipStep(step);
    return;
  }

  if (step.type === "unlock") {
    track("lender_match_unlock_view", { stage: step.stage });
    track("contact_step_view", { stage: step.stage });
    renderUnlockStep(step);
    return;
  }

  renderChoiceStep(step);
}

function updateProgress(activeStage) {
  const activeIndex = stageOrder.indexOf(activeStage);

  stageNodes.forEach((node) => {
    const nodeIndex = stageOrder.indexOf(node.dataset.stage);
    node.classList.toggle("is-active", node.dataset.stage === activeStage);
    node.classList.toggle("is-complete", nodeIndex < activeIndex);
  });
}

function startIfNeeded() {
  if (!state.started) {
    state.started = true;
    track("form_start", { first_step: steps[0].id });
  }
}

function stepShell(step, body) {
  app.innerHTML = `
    <div class="step-kicker">
      <span class="stage-pill">${step.stageLabel}</span>
      <span class="time-pill">About 1 minute</span>
    </div>
    <h2 class="question-title">${step.title}</h2>
    ${step.helper ? `<p class="question-helper">${step.helper}</p>` : ""}
    ${body}
  `;
}

function renderChoiceStep(step) {
  const selected = state.answers[step.answerKey] || "";
  const choices = step.choices
    .map(
      (choice) => `
        <button class="answer-card ${selected === choice.value ? "is-selected" : ""}"
          type="button"
          data-choice="${escapeAttr(choice.value)}"
          aria-pressed="${selected === choice.value ? "true" : "false"}">
          <span class="answer-label">
            ${choice.label}
            <span class="choice-dot" aria-hidden="true"></span>
          </span>
          ${choice.detail ? `<span class="answer-detail">${choice.detail}</span>` : ""}
        </button>
      `
    )
    .join("");

  stepShell(
    step,
    `
      <div class="answer-grid ${step.layout === "stack" ? "answer-stack" : ""}">${choices}</div>
      <div class="nav-row">
        ${backButton()}
        <span class="reassurance">Choose the closest fit.</span>
      </div>
    `
  );

  app.querySelectorAll(".answer-card").forEach((button) => {
    button.addEventListener("click", () => {
      startIfNeeded();
      setAnswer(step, button.dataset.choice);
      track("form_step_complete", {
        step_id: step.id,
        stage: step.stage,
        answer: button.dataset.choice
      });
      renderChoiceStep(step);
      window.setTimeout(() => goNext(), 180);
    });
  });

  wireBackButton();
}

function renderZipStep(step) {
  const value = state.answers[step.answerKey] || "";
  stepShell(
    step,
    `
      <div class="input-stack">
        <div class="field">
          <label for="zipInput">Property ZIP code</label>
          <input id="zipInput" name="zip" inputmode="numeric" autocomplete="postal-code"
          maxlength="10" value="${escapeAttr(value)}" placeholder="Example: 75201">
          <span class="field-note">Property location, not mailing address.</span>
        </div>
      </div>
      <div class="nav-row">
        ${backButton()}
        <button class="btn btn-primary" type="button" id="zipNext">Find My Match</button>
      </div>
    `
  );

  const input = app.querySelector("#zipInput");
  const nextButton = app.querySelector("#zipNext");

  input.addEventListener("input", () => {
    state.answers[step.answerKey] = input.value.trim();
  });

  nextButton.addEventListener("click", () => {
    startIfNeeded();
    const cleaned = input.value.trim();
    if (cleaned.length < 5) {
      input.focus();
      input.setAttribute("aria-invalid", "true");
      return;
    }

    input.removeAttribute("aria-invalid");
    state.answers[step.answerKey] = cleaned;
    track("form_step_complete", {
      step_id: step.id,
      stage: step.stage,
      answer: cleaned
    });
    goNext();
  });

  wireBackButton();
}

function renderMatchingScreen(nextIndex) {
  window.clearTimeout(state.matchTimer);
  updateProgress("you");
  const startedAt = Date.now();
  track("match_loading_view", {
    from_step: steps[state.currentStep].id,
    next_step: steps[nextIndex].id
  });

  app.innerHTML = `
    <div class="matching-screen" role="status" aria-live="polite">
      <div class="match-loader" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h2 class="question-title">Finding your best-matched lender</h2>
      <p class="question-helper">Checking the deal, property, and numbers.</p>

      <div class="match-status">
        <div>
          <span class="status-dot"></span>
          <strong>Deal fit</strong>
        </div>
        <div>
          <span class="status-dot"></span>
          <strong>Property type</strong>
        </div>
        <div>
          <span class="status-dot"></span>
          <strong>Lender match</strong>
        </div>
      </div>
    </div>
  `;

  loadLenders()
    .then((lenders) => {
      state.lenderMatch = selectBestLender(lenders, state.answers);
      track("lender_match_selected", {
        lender_name: state.lenderMatch ? state.lenderMatch.name : "",
        score: state.lenderMatch ? state.lenderMatch.score : 0,
        source: state.lenderSource
      });
    })
    .catch(() => {
      state.lenderMatch = selectBestLender(parseLenderCsv(FALLBACK_LENDER_CSV), state.answers);
      state.lenderSource = "embedded_fallback";
    })
    .finally(() => {
      const remaining = Math.max(500, 1900 - (Date.now() - startedAt));
      state.matchTimer = window.setTimeout(() => {
        state.currentStep = nextIndex;
        state.matchTimer = null;
        render();
      }, remaining);
    });
}

function renderUnlockStep(step) {
  const summaryHighlights = summaryItems()
    .filter((item) => ["Deal", "Property", "Loan need", "Credit", "ZIP"].includes(item.label))
    .map(
      (item) => `
        <div class="summary-chip">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join("");

  stepShell(
    step,
    `
      <div class="unlock-layout">
        <section class="match-ready-panel" aria-label="Lender match preview">
          <div class="match-ready-copy">
            <strong>Your lender match is ready</strong>
            <span>One quick contact step unlocks the matched lender details.</span>
          </div>
          <div class="locked-match" aria-hidden="true">
            ${lockedCard("Best-matched lender", "Ready to reveal")}
          </div>
        </section>

        <div class="summary-chips" aria-label="Deal snapshot">${summaryHighlights}</div>

        <section class="contact-panel clean-contact" aria-label="Unlock matched lender">
          <form class="contact-fields" id="contactForm" novalidate>
            <div class="two-col">
              <div class="field">
                <label for="firstName">First name</label>
                <input id="firstName" name="firstName" autocomplete="given-name"
                  value="${escapeAttr(state.contact.firstName)}">
              </div>
              <div class="field">
                <label for="lastName">Last name</label>
                <input id="lastName" name="lastName" autocomplete="family-name"
                  value="${escapeAttr(state.contact.lastName)}">
              </div>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" inputmode="email" autocomplete="email"
                value="${escapeAttr(state.contact.email)}" placeholder="you@example.com">
            </div>

            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel"
                value="${escapeAttr(state.contact.phone)}" placeholder="(555) 555-5555">
            </div>

            <label class="consent">
              <input id="consent" name="consent" type="checkbox" ${state.contact.consent ? "checked" : ""}>
            <span>
              I agree to be contacted by REInvestorGuide and lending partners about this request.
              Message and data rates may apply.
            </span>
            </label>
          </form>

          <div class="contact-actions">
            <div class="error-text" id="formError" role="alert"></div>
            <div class="contact-button-row">
              <button class="btn btn-secondary" type="button" id="unlockBack">Back</button>
              <button class="btn btn-primary" type="submit" form="contactForm">
                Send My Lender Match
              </button>
            </div>
          </div>
        </section>
      </div>
    `
  );

  const contactForm = app.querySelector("#contactForm");
  const error = app.querySelector("#formError");

  contactForm.addEventListener("input", syncContact);
  contactForm.addEventListener("change", syncContact);
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncContact();

    const validation = validateContact();
    if (validation) {
      error.textContent = validation;
      return;
    }

    error.textContent = "";
    const submitButton = app.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    track("form_submit", {
      stage: step.stage,
      deal: {
        fundingNeed: state.answers.deal,
        propertyType: state.answers.propertyType,
        zip: state.answers.zip
      }
    });

    const backendAssignment = await assignWithAppsScript();
    if (backendAssignment) {
      state.lenderSource = "apps_script";
      state.lenderMatch = backendAssignment.lender;
      state.affiliateSource = "apps_script";
      state.affiliateMatches = backendAssignment.affiliates || [];
    } else if (state.lenderMatch) {
      recordRoundRobinAssignment(state.lenderMatch);
    } else {
      state.lenderMatch = null;
    }

    state.completed = true;
    track("lead_submission_success", { source: "mockup" });
    render();
  });

  app.querySelector("#unlockBack").addEventListener("click", goBack);
}

function lockedCard(title, detail) {
  return `
    <div class="locked-card">
      <div>
        <strong>${title}</strong>
        <span>${detail}</span>
      </div>
      <div class="locked-bars">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  `;
}

function syncContact() {
  const form = app.querySelector("#contactForm");
  if (!form) return;

  const formData = new FormData(form);
  state.contact.firstName = String(formData.get("firstName") || "").trim();
  state.contact.lastName = String(formData.get("lastName") || "").trim();
  state.contact.email = String(formData.get("email") || "").trim();
  state.contact.phone = String(formData.get("phone") || "").trim();
  state.contact.consent = form.querySelector("#consent").checked;
}

function validateContact() {
  const requiredFields = [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["email", "Email"],
    ["phone", "Phone"]
  ];

  for (const [key, label] of requiredFields) {
    if (!state.contact[key]) {
      return `${label} is required.`;
    }
  }

  if (!state.contact.email.includes("@") || !state.contact.email.includes(".")) {
    return "Enter a valid email.";
  }

  if (state.contact.phone.replace(/\D/g, "").length < 10) {
    return "Enter a valid phone number.";
  }

  if (!state.contact.consent) {
    return "Please agree to be contacted about this request.";
  }

  return "";
}

async function assignWithAppsScript() {
  if (!MATCHING_API_URL) {
    return null;
  }

  try {
    const payload = await requestAppsScriptAssignment(buildLeadPayload());

    if (!payload || !payload.ok) {
      throw new Error(payload && payload.error ? payload.error : "Apps Script assignment failed.");
    }

    track("apps_script_assignment", {
      matched: Boolean(payload.matched),
      lender_name: payload.lender ? payload.lender.name : "",
      affiliate_count: Array.isArray(payload.affiliates) ? payload.affiliates.length : 0,
      lead_id: payload.leadId || ""
    });

    return {
      lender: payload.matched && payload.lender ? normalizeApiLender(payload.lender) : null,
      affiliates: Array.isArray(payload.affiliates) ? payload.affiliates.map(normalizeApiAffiliate) : []
    };
  } catch (error) {
    console.info("[REIG lender engine] Apps Script unavailable, using local fallback", error.message);
    return null;
  }
}

function requestAppsScriptAssignment(lead) {
  return new Promise((resolve, reject) => {
    const callbackName = `reigLeadAssignment${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Apps Script assignment request timed out."));
    }, 10000);
    const query = new URLSearchParams({
      callback: callbackName,
      payload: JSON.stringify({ lead })
    });
    const separator = MATCHING_API_URL.includes("?") ? "&" : "?";

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Apps Script assignment script failed to load."));
    };

    script.src = `${MATCHING_API_URL}${separator}${query.toString()}`;
    document.head.appendChild(script);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }
  });
}

function buildLeadPayload() {
  return {
    firstName: state.contact.firstName,
    lastName: state.contact.lastName,
    email: state.contact.email,
    phone: state.contact.phone,
    deal: state.answers.deal || "",
    propertyType: state.answers.propertyType || "",
    occupancy: state.answers.occupancy || "",
    loanAmount: state.answers.loanAmount || "",
    creditRange: state.answers.creditRange || "",
    zip: state.answers.zip || "",
    hasRealtor: state.answers.hasRealtor || "",
    realtorMatch: state.answers.realtorMatch || "",
    source: "reig-static-mockup"
  };
}

function normalizeApiLender(lender) {
  return {
    name: lender.name || "",
    logo: lender.logo || "",
    website: lender.website || "",
    phone: lender.phone || "",
    benefits: Array.isArray(lender.benefits) ? lender.benefits : [],
    score: lender.score || 0,
    states: [],
    loanTypes: [],
    propertyTypes: [],
    usage: [],
    loanAmounts: [],
    creditScores: [],
    scoreReasons: []
  };
}

function normalizeApiAffiliate(affiliate) {
  return {
    name: affiliate.name || "",
    instructions: affiliate.instructions || "",
    cta: affiliate.cta || "",
    logo: affiliate.logo || "",
    link: affiliate.link || "",
    benefits: Array.isArray(affiliate.benefits) ? affiliate.benefits.slice(0, 3) : [],
    score: affiliate.score || 0,
    rowIndex: affiliate.rowIndex || 0
  };
}

function renderSuccess() {
  const lender = state.lenderMatch || selectBestLender(state.lenders || parseLenderCsv(FALLBACK_LENDER_CSV), state.answers);
  const websiteHref = lender ? normalizeWebsite(lender.website) : "#";
  const phoneHref = lender ? `tel:${lender.phone.replace(/\D/g, "")}` : "#";
  const benefits = lender ? lender.benefits.slice(0, 3) : [];
  const affiliateMatches = state.affiliateMatches && state.affiliateMatches.length
    ? state.affiliateMatches
    : selectAffiliateMatches(parseAffiliateCsv(FALLBACK_AFFILIATE_CSV), state.answers);
  const responseCopy = lender
    ? "During business hours Monday-Friday, your matched lender will reach out within 1 hour. After hours or on the weekend, they will follow up the next business day."
    : "We're still working on finding the right lender for this deal. We'll reach out as soon as we're able to find a strong match.";

  app.innerHTML = `
    <div class="success-screen">
      <span class="success-badge" aria-hidden="true"></span>
      <h2>Thanks, ${escapeHtml(state.contact.firstName)}.</h2>
      <p>
        ${
          lender
            ? "Your request was received. Here is the lender match for this deal."
            : "Your request was received. We're reviewing the deal now."
        }
      </p>
      ${lender ? lenderResultCard(lender, benefits, websiteHref, phoneHref) : noMatchResultCard()}
      <div class="response-window">
        <strong>What happens next</strong>
        <span>${responseCopy}</span>
      </div>
      ${
        affiliateMatches.length
          ? `<button class="btn btn-primary affiliate-trigger" type="button" id="affiliateMatchesButton">We have more matches for you</button>`
          : ""
      }
    </div>
  `;

  wireAffiliateMatchesButton(affiliateMatches);
}

function noMatchResultCard() {
  return `
    <section class="no-match-result" aria-label="Lender match still in progress">
      <span class="result-kicker">Match in progress</span>
      <h3>We're still working on your lender match.</h3>
      <p>
        This deal needs a closer look, so we're not showing a lender that may not fit.
        The REInvestorGuide team will keep reviewing the request and follow up once a good match is found.
      </p>
    </section>
  `;
}

function lenderResultCard(lender, benefits, websiteHref, phoneHref) {
  return `
    <section class="lender-result" aria-label="Matched lender">
      <div class="lender-logo-wrap">
        ${lender.logo ? `<img src="${escapeAttr(lender.logo)}" alt="${escapeAttr(lender.name)} logo">` : `<span>${escapeHtml(lender.name.charAt(0))}</span>`}
      </div>
      <div class="lender-result-body">
        <span class="result-kicker">Best-matched lender</span>
        <h3>${escapeHtml(lender.name)}</h3>
        <ul>
          ${benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("")}
        </ul>
        <div class="lender-actions">
          <a class="btn btn-primary" href="${escapeAttr(websiteHref)}" target="_blank" rel="noopener">Visit Website</a>
          <a class="btn btn-secondary" href="${escapeAttr(phoneHref)}">${escapeHtml(lender.phone)}</a>
        </div>
      </div>
    </section>
  `;
}

function wireAffiliateMatchesButton(initialMatches) {
  const button = app.querySelector("#affiliateMatchesButton");
  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Finding matches...";

    try {
      const matches = state.affiliateMatches && state.affiliateMatches.length
        ? state.affiliateMatches
        : selectAffiliateMatches(await loadAffiliates(), state.answers);
      state.affiliateMatches = matches;
      track("affiliate_matches_opened", {
        affiliate_count: matches.length,
        source: state.affiliateSource || "embedded_fallback"
      });
      renderAffiliateModal(matches);
    } catch (error) {
      const fallbackMatches = initialMatches.length
        ? initialMatches
        : selectAffiliateMatches(parseAffiliateCsv(FALLBACK_AFFILIATE_CSV), state.answers);
      console.info("[REIG affiliate engine] modal fallback", error.message);
      renderAffiliateModal(fallbackMatches);
    } finally {
      button.disabled = false;
      button.textContent = "We have more matches for you";
    }
  });
}

function renderAffiliateModal(matches) {
  const existing = document.querySelector(".affiliate-modal");
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement("div");
  modal.className = "affiliate-modal";
  modal.innerHTML = `
    <div class="affiliate-modal-backdrop" data-affiliate-close></div>
    <section class="affiliate-dialog" role="dialog" aria-modal="true" aria-labelledby="affiliateDialogTitle">
      <button class="affiliate-close" type="button" aria-label="Close" data-affiliate-close></button>
      <span class="result-kicker">Partner matches</span>
      <h3 id="affiliateDialogTitle">More matches for your deal</h3>
      <div class="affiliate-list">
        ${
          matches.length
            ? matches.map(affiliateCard).join("")
            : `<p class="affiliate-empty">No extra partner matches are ready for this deal yet.</p>`
        }
      </div>
    </section>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("modal-open");

  let keyHandler;
  const closeModal = () => closeAffiliateModal(modal, keyHandler);

  modal.querySelectorAll("[data-affiliate-close]").forEach((closeButton) => {
    closeButton.addEventListener("click", closeModal);
  });

  modal.querySelectorAll(".affiliate-link").forEach((link) => {
    link.addEventListener("click", () => {
      track("affiliate_link_clicked", {
        affiliate_name: link.dataset.affiliateName || ""
      });
    });
  });

  keyHandler = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };
  document.addEventListener("keydown", keyHandler);
  modal.querySelector(".affiliate-close").focus();
}

function closeAffiliateModal(modal, keyHandler) {
  modal.remove();
  document.body.classList.remove("modal-open");
  if (keyHandler) {
    document.removeEventListener("keydown", keyHandler);
  }
}

function affiliateCard(affiliate) {
  const benefits = affiliate.benefits.slice(0, 3);
  const cta = affiliate.cta || "Visit match";
  const logoClass = `affiliate-logo-${normalizeMatchValue(affiliate.name).replace(/\s+/g, "")}`;
  return `
    <article class="affiliate-card">
      <div class="affiliate-logo ${escapeAttr(logoClass)}">
        ${affiliate.logo ? `<img src="${escapeAttr(affiliate.logo)}" alt="${escapeAttr(affiliate.name)} logo">` : `<span>${escapeHtml(affiliate.name.charAt(0))}</span>`}
      </div>
      <div class="affiliate-card-body">
        <h4>${escapeHtml(affiliate.name)}</h4>
        <ul>
          ${benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("")}
        </ul>
        <a class="btn btn-secondary affiliate-link" href="${escapeAttr(normalizeWebsite(affiliate.link))}"
          target="_blank" rel="noopener" data-affiliate-name="${escapeAttr(affiliate.name)}">
          ${escapeHtml(cta)}
        </a>
      </div>
    </article>
  `;
}

function summaryItems() {
  const items = [
    ["Deal", state.answers.deal],
  ];

  if (state.answers.deal === "Purchase" && state.answers.hasRealtor) {
    items.push(["Realtor", state.answers.hasRealtor]);
  }

  if (state.answers.deal === "Purchase" && state.answers.realtorMatch) {
    items.push(["Realtor match", state.answers.realtorMatch]);
  }

  items.push(
    ["Property", state.answers.propertyType],
    ["Process", state.answers.timeline],
    ["Value", state.answers.propertyValue],
    ["Loan need", state.answers.loanAmount],
    ["Use", state.answers.occupancy],
    ["Credit", state.answers.creditRange],
    ["ZIP", state.answers.zip]
  );

  return items.map(([label, value]) => ({
    label,
    value: value || "Not provided"
  }));
}

function goNext() {
  const nextIndex = nextStepIndex(state.currentStep);

  if (nextIndex === -1) {
    return;
  }

  if (steps[nextIndex].type === "unlock") {
    renderMatchingScreen(nextIndex);
    return;
  }

  state.currentStep = nextIndex;
  render();
}

function goBack() {
  const previousIndex = previousStepIndex(state.currentStep);

  if (previousIndex !== -1) {
    state.currentStep = previousIndex;
    render();
  }
}

function backButton() {
  if (previousStepIndex(state.currentStep) === -1) {
    return '<span></span>';
  }

  return '<button class="btn btn-secondary" type="button" data-back>Back</button>';
}

function wireBackButton() {
  const back = app.querySelector("[data-back]");
  if (back) {
    back.addEventListener("click", goBack);
  }
}

async function loadLenders() {
  if (state.lenders) {
    return state.lenders;
  }

  try {
    state.lenders = await loadLendersFromGoogleSheet();
    if (!state.lenders.length) {
      throw new Error("Google Sheet returned no parsed lender rows.");
    }
    state.lenderSource = "google_sheet";
  } catch (error) {
    console.info("[REIG lender engine] using embedded fallback", error.message);
    state.lenderSource = "embedded_fallback";
    state.lenders = parseLenderCsv(FALLBACK_LENDER_CSV);
  }

  return state.lenders;
}

function loadLendersFromGoogleSheet() {
  return loadGoogleSheetTab(LENDER_SHEET_NAME).then(parseGvizTable);
}

async function loadAffiliates() {
  if (state.affiliates) {
    return state.affiliates;
  }

  try {
    state.affiliates = await loadAffiliatesFromGoogleSheet();
    if (!state.affiliates.length) {
      throw new Error("Google Sheet returned no parsed affiliate rows.");
    }
    state.affiliateSource = "google_sheet";
  } catch (error) {
    console.info("[REIG affiliate engine] using embedded fallback", error.message);
    state.affiliateSource = "embedded_fallback";
    state.affiliates = parseAffiliateCsv(FALLBACK_AFFILIATE_CSV);
  }

  return state.affiliates;
}

function loadAffiliatesFromGoogleSheet() {
  return loadGoogleSheetTab(AFFILIATE_SHEET_NAME).then(parseAffiliateGvizTable);
}

function loadGoogleSheetTab(sheetName) {
  return new Promise((resolve, reject) => {
    const callbackName = `reigSheet${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`${sheetName} sheet request timed out.`));
    }, 7000);

    window[callbackName] = (payload) => {
      cleanup();

      if (!payload || payload.status === "error" || !payload.table) {
        reject(new Error(`${sheetName} sheet did not return table data.`));
        return;
      }

      resolve(payload.table);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error(`${sheetName} sheet script failed to load.`));
    };

    script.src = `${SHEET_GVIZ_URL}?sheet=${encodeURIComponent(sheetName)}&tqx=out:json;responseHandler:${callbackName}`;
    document.head.appendChild(script);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }
  });
}

function parseGvizTable(table) {
  return parseGvizRecords(table, hasRequiredLenderHeaders)
    .map(normalizeLender)
    .filter((lender) => lender.name);
}

function parseAffiliateGvizTable(table) {
  return parseGvizRecords(table, hasRequiredAffiliateHeaders)
    .map((record, index) => normalizeAffiliate(record, index))
    .filter((affiliate) => affiliate.name);
}

function parseGvizRecords(table, hasRequiredHeaders) {
  let headers = table.cols.map((column) => normalizeHeader(column.label || column.id));
  let rows = table.rows || [];

  if (!hasRequiredHeaders(headers) && rows.length) {
    headers = rows[0].c.map((cell) => normalizeHeader(cell ? String(cell.v || cell.f || "") : ""));
    rows = rows.slice(1);
  }

  return rows
    .map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        if (header) {
          const cell = row.c[index];
          record[header] = cell ? String(cell.v || cell.f || "").trim() : "";
        }
      });

      return record;
    });
}

function hasRequiredLenderHeaders(headers) {
  return headers.includes("lender_name") && headers.includes("website") && headers.includes("phone_number");
}

function hasRequiredAffiliateHeaders(headers) {
  return headers.includes("affiliate_name") && headers.includes("affiliate_link");
}

function parseLenderCsv(csvText) {
  const rows = parseCsvRows(csvText).filter((row) => row.some((cell) => String(cell).trim()));
  const headers = rows.shift().map((header) => normalizeHeader(header));

  return rows
    .map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        if (header) {
          record[header] = String(row[index] || "").trim();
        }
      });

      return normalizeLender(record);
    })
    .filter((lender) => lender.name);
}

function parseAffiliateCsv(csvText) {
  const rows = parseCsvRows(csvText).filter((row) => row.some((cell) => String(cell).trim()));
  const headers = rows.shift().map((header) => normalizeHeader(header));

  return rows
    .map((row, index) => {
      const record = {};
      headers.forEach((header, cellIndex) => {
        if (header) {
          record[header] = String(row[cellIndex] || "").trim();
        }
      });

      return normalizeAffiliate(record, index);
    })
    .filter((affiliate) => affiliate.name);
}

function parseCsvRows(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function normalizeHeader(header) {
  return String(header)
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("/", "_");
}

function normalizeLender(record) {
  const benefits = [record.benefit_1, record.benefit_2, record.benefit_3]
    .map((benefit) => String(benefit || "").trim())
    .filter(Boolean);

  return {
    name: record.lender_name || "",
    logo: record.logo_link || "",
    website: record.website || "",
    phone: record.phone_number || "",
    states: splitList(record.states),
    loanTypes: splitList(record.loan_types),
    propertyTypes: splitList(record.property_type),
    usage: splitList(record.usage),
    loanAmounts: splitList(record.loan_amounts),
    creditScores: splitList(record.credit_score),
    benefits,
    score: 0,
    scoreReasons: []
  };
}

function normalizeAffiliate(record, rowIndex = 0) {
  const benefits = [record.benefit_1, record.benefit_2, record.benefit_3]
    .map((benefit) => String(benefit || "").trim())
    .filter(Boolean);

  return {
    name: record.affiliate_name || "",
    instructions: record.when_to_show || "",
    cta: record.cta || record.cta_copy || record.button_copy || "",
    logo: record.logo_link || "",
    link: record.affiliate_link || "",
    benefits,
    score: 0,
    rowIndex
  };
}

function splitList(value) {
  return String(value || "")
    .replaceAll("\n", ",")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function selectBestLender(lenders, answers) {
  const displayable = lenders.filter((lender) => lender.name && lender.website && lender.phone && lender.benefits.length);
  const candidatePool = displayable.length ? displayable : lenders;
  const stateCode = stateFromZip(answers.zip);
  const criteria = {
    state: stateCode,
    loanType: mapLoanType(answers.deal),
    propertyType: answers.propertyType,
    usage: answers.occupancy,
    loanAmount: answers.loanAmount,
    creditScore: answers.creditRange
  };

  const qualified = candidatePool.filter((lender) => lenderQualifies(lender, criteria));

  if (!qualified.length) {
    return null;
  }

  const scored = qualified.map((lender) => scoreLender(lender, criteria));
  return selectRoundRobinLender(topScoringLenders(scored));
}

function lenderQualifies(lender, criteria) {
  return (
    listAllows(lender.states, criteria.state) &&
    listAllows(lender.loanTypes, criteria.loanType) &&
    listAllows(lender.propertyTypes, criteria.propertyType) &&
    listAllows(lender.usage, criteria.usage) &&
    listAllows(lender.loanAmounts, criteria.loanAmount) &&
    listAllows(lender.creditScores, criteria.creditScore)
  );
}

function listAllows(list, value) {
  if (!list.length || !value) {
    return true;
  }

  return list.some((item) => normalizeMatchValue(item) === normalizeMatchValue(value));
}

function scoreLender(lender, criteria) {
  let score = 0;
  const reasons = [];

  score += scoreListMatch(lender.states, criteria.state, 8, reasons, "state");
  score += scoreListMatch(lender.loanTypes, criteria.loanType, 8, reasons, "loan type");
  score += scoreListMatch(lender.propertyTypes, criteria.propertyType, 6, reasons, "property");
  score += scoreListMatch(lender.usage, criteria.usage, 5, reasons, "usage");
  score += scoreListMatch(lender.loanAmounts, criteria.loanAmount, 4, reasons, "amount");
  score += scoreListMatch(lender.creditScores, criteria.creditScore, 4, reasons, "credit");
  score += Math.min(lender.benefits.length, 3);

  return {
    ...lender,
    score,
    specificityScore: specificityScore(lender),
    scoreReasons: reasons
  };
}

function scoreListMatch(list, value, matchScore, reasons, label) {
  if (!list.length || !value) {
    return 0;
  }

  const matched = list.some((item) => normalizeMatchValue(item) === normalizeMatchValue(value));
  reasons.push(`${label}:${matched ? "match" : "miss"}`);
  return matched ? matchScore : 0;
}

function topScoringLenders(scoredLenders) {
  const topScore = Math.max(...scoredLenders.map((lender) => lender.score));
  return scoredLenders.filter((lender) => lender.score === topScore);
}

function specificityScore(lender) {
  return [
    lender.states,
    lender.loanTypes,
    lender.propertyTypes,
    lender.usage,
    lender.loanAmounts,
    lender.creditScores
  ].reduce((score, list) => score + (list.length ? 1 / list.length : 0), 0);
}

function selectAffiliateMatches(affiliates, answers) {
  return affiliates
    .filter((affiliate) => affiliate.name && affiliate.link && affiliate.benefits.length)
    .map((affiliate) => ({
      ...affiliate,
      score: scoreAffiliate(affiliate, answers)
    }))
    .filter((affiliate) => affiliate.score > 0)
    .sort((a, b) => {
      const priorityDifference = affiliateDisplayPriority(b) - affiliateDisplayPriority(a);
      if (priorityDifference) {
        return priorityDifference;
      }

      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return a.rowIndex - b.rowIndex;
    })
    .slice(0, 3);
}

function scoreAffiliate(affiliate, answers) {
  const instructions = normalizeMatchValue(affiliate.instructions);
  const deal = normalizeMatchValue(answers.deal);
  const credit = normalizeMatchValue(answers.creditRange);
  const purchaseDeal = deal === "purchase";
  const refiOrCashOut = deal === "refinance" || deal === "cashout";
  const nonOwner = isNonOwnerOccupied(answers.occupancy);
  const rentalUse = isRentalUse(answers.occupancy);

  if (instructions.includes("cash out") || instructions.includes("cashout") || instructions.includes("refi")) {
    return refiOrCashOut ? 90 : 0;
  }

  if (instructions.includes("purchasing a rental")) {
    return purchaseDeal && rentalUse ? 100 : 0;
  }

  if (instructions.includes("purchasing")) {
    return purchaseDeal ? 70 : 0;
  }

  if (instructions.includes("bad") || instructions.includes("poor credit")) {
    return credit.includes("poor") ? 85 : 0;
  }

  if (instructions.includes("owner occupied")) {
    return nonOwner ? 60 : 0;
  }

  return 0;
}

function affiliateDisplayPriority(affiliate) {
  return normalizeMatchValue(affiliate.name) === "steadily" ? 1 : 0;
}

function isRentalUse(occupancy) {
  const value = normalizeMatchValue(occupancy);
  return value === "longterm rental" || value === "shortterm rental";
}

function isNonOwnerOccupied(occupancy) {
  return normalizeMatchValue(occupancy) !== "owneroccupied";
}

function selectRoundRobinLender(scoredLenders) {
  if (!scoredLenders.length) {
    return null;
  }

  const ledger = loadRoundRobinLedger();

  return [...scoredLenders].sort((a, b) => {
    const aLedger = ledger[lenderKey(a)] || { count: 0, lastAssigned: 0 };
    const bLedger = ledger[lenderKey(b)] || { count: 0, lastAssigned: 0 };

    if (aLedger.count !== bLedger.count) {
      return aLedger.count - bLedger.count;
    }

    if (aLedger.lastAssigned !== bLedger.lastAssigned) {
      return aLedger.lastAssigned - bLedger.lastAssigned;
    }

    if (a.specificityScore !== b.specificityScore) {
      return b.specificityScore - a.specificityScore;
    }

    return b.score - a.score;
  })[0];
}

function recordRoundRobinAssignment(lender) {
  const key = lenderKey(lender);
  if (!key) {
    return;
  }

  const ledger = loadRoundRobinLedger();
  const current = ledger[key] || { count: 0, lastAssigned: 0 };
  ledger[key] = {
    count: current.count + 1,
    lastAssigned: Date.now()
  };
  saveRoundRobinLedger(ledger);
}

function loadRoundRobinLedger() {
  try {
    return JSON.parse(window.localStorage.getItem(ROUND_ROBIN_STORAGE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveRoundRobinLedger(ledger) {
  try {
    window.localStorage.setItem(ROUND_ROBIN_STORAGE_KEY, JSON.stringify(ledger));
  } catch (error) {
    console.info("[REIG lender engine] round robin ledger was not saved", error.message);
  }
}

function lenderKey(lender) {
  return normalizeMatchValue(lender.name);
}

function normalizeMatchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("-", "")
    .replaceAll("/", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapLoanType(deal) {
  const map = {
    Purchase: "Purchase",
    Refinance: "Refi",
    "Cash-out": "Cash-Out"
  };

  return map[deal] || deal;
}

function normalizeWebsite(website) {
  if (!website) {
    return "#";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function stateFromZip(zip) {
  const prefix = Number(String(zip || "").trim().slice(0, 3));
  if (!Number.isFinite(prefix)) return "";

  const ranges = [
    [350, 369, "AL"], [995, 999, "AK"], [850, 865, "AZ"], [716, 729, "AR"],
    [900, 961, "CA"], [800, 816, "CO"], [60, 69, "CT"], [197, 199, "DE"],
    [200, 205, "DC"], [320, 349, "FL"], [300, 319, "GA"], [967, 968, "HI"],
    [832, 838, "ID"], [600, 629, "IL"], [460, 479, "IN"], [500, 528, "IA"],
    [660, 679, "KS"], [400, 427, "KY"], [700, 714, "LA"], [39, 49, "ME"],
    [206, 219, "MD"], [10, 27, "MA"], [480, 499, "MI"], [550, 567, "MN"],
    [386, 397, "MS"], [630, 658, "MO"], [590, 599, "MT"], [680, 693, "NE"],
    [889, 898, "NV"], [30, 38, "NH"], [70, 89, "NJ"], [870, 884, "NM"],
    [100, 149, "NY"], [270, 289, "NC"], [580, 588, "ND"], [430, 459, "OH"],
    [730, 749, "OK"], [970, 979, "OR"], [150, 196, "PA"], [28, 29, "RI"],
    [290, 299, "SC"], [570, 577, "SD"], [370, 385, "TN"], [750, 799, "TX"],
    [840, 847, "UT"], [50, 59, "VT"], [201, 246, "VA"], [980, 994, "WA"],
    [247, 268, "WV"], [530, 549, "WI"], [820, 831, "WY"]
  ];

  const match = ranges.find(([start, end]) => prefix >= start && prefix <= end);
  if (match) return match[2];
  if (prefix === 733 || prefix === 885) return "TX";
  if (prefix === 755) return "AR";
  if (prefix === 717) return "LA";
  if (prefix === 398 || prefix === 399) return "GA";
  if (prefix === 55) return "MA";
  return "";
}

function setAnswer(step, value) {
  state.answers[step.answerKey] = value;

  if (step.answerKey === "deal" && value !== "Purchase") {
    delete state.answers.hasRealtor;
    delete state.answers.realtorMatch;
  }

  if (step.answerKey === "hasRealtor" && value !== "No") {
    delete state.answers.realtorMatch;
  }
}

function shouldShowStep(step) {
  return !step.condition || step.condition(state.answers);
}

function nextStepIndex(fromIndex) {
  for (let index = fromIndex + 1; index < steps.length; index += 1) {
    if (shouldShowStep(steps[index])) {
      return index;
    }
  }

  return -1;
}

function previousStepIndex(fromIndex) {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
    if (shouldShowStep(steps[index])) {
      return index;
    }
  }

  return -1;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

render();
