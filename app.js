const notificationTriggerBtn = document.getElementById(
    "notifications-menu-trigger"
  ),
  notificationMenuDropdown = document.getElementById(
    "notifications-menu-content"
  ),
  storeMenuTriggerBtn = document.getElementById("store-menu-trigger"),
  storeMenuDropdown = document.getElementById("store-menu-content"),
  searchBar = document.querySelector(".search-bar"),
  searchInputField = document.querySelector(".search-input-field"),
  trailCallOutContainer = document.getElementById("trail-callout"),
  dismissBtn = document.getElementById("btn-dismiss"),
  accordionBtnElement = document.getElementById("guide-tab-accordion"),
  accordionDownElement = document.querySelector(".accordion-down"),
  accordionUpElement = document.querySelector(".accordion-up"),
  setupGuideTab = document.getElementById("step-tab"),
  stepTabs = setupGuideTab.querySelectorAll(".step-tab-panel"),
  allCheckboxes = setupGuideTab.querySelectorAll("[role='checkbox']"),
  checksCompleted = document.getElementById("completed"),
  checkedStatus = document.getElementById("checked-status"),
  progressBar = document.getElementById("progress");

function app() {
  // focus on input field when searchbar area is clicked
  searchBar.addEventListener("click", () => {
    searchInputField.focus();
  });

  //  handle menu button triggers
  notificationTriggerBtn.addEventListener("click", () => {
    toggleMenu(notificationTriggerBtn, notificationMenuDropdown);
  });
  storeMenuTriggerBtn.addEventListener("click", () => {
    toggleMenu(storeMenuTriggerBtn, storeMenuDropdown);
  });

  dismissBtn.addEventListener("click", handleOnDismissBtnClick);
  accordionBtnElement.addEventListener("click", handleAccordionClick);

  // handle checkboxes on click event
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      handleCheckboxClick(checkbox);
    });
  });

  // handle step-tab events
  stepTabs.forEach((stepTab, stepTabIndex, stepTabs) => {
    stepTab.addEventListener("click", () => {
      toggleSetupGuideSteps(stepTab);
    });

    stepTab.addEventListener("keydown", (event) => {
      handleArrowKeyPress(event, stepTabIndex, stepTabs);

      if (event.code == "Space" || event.code == "Enter")
        toggleSetupGuideSteps(stepTab);
    });
  });
}

// hide trail callout on dismiss button click
function handleOnDismissBtnClick() {
  const trailCalloutStatus = document.querySelector(".trail-callout-status");
  trailCalloutStatus.ariaLabel = "Trail callout banner is closed";

  trailCallOutContainer.classList.add("hide");
}

function handleArrowKeyPress(event, menuItemIndex, menuItems) {
  const isFirstMenuItem = menuItemIndex === 0;
  const isLastMenuItem = menuItemIndex === menuItems.length - 1;

  const nextMenuItem = menuItems.item(menuItemIndex + 1);
  const previousMenuItem = menuItems.item(menuItemIndex - 1);

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    if (isLastMenuItem) {
      menuItems.item(0).focus();
      return;
    }
    nextMenuItem.focus();
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    if (isFirstMenuItem) {
      menuItems.item(menuItems.length - 1).focus();
      return;
    }
    previousMenuItem.focus();
  }
}

function detectOutsideClick(menuTriggeredBtn, menuDropdown) {
  document.addEventListener("click", (event) => {
    const activeMenu = { menuTriggeredBtn, menuDropdown };
    if (
      activeMenu?.menuTriggeredBtn.ariaExpanded === "true" &&
      !activeMenu?.menuTriggeredBtn.contains(event.target) &&
      !activeMenu?.menuDropdown.contains(event.target)
    ) {
      // close active menu when outside click is detected
      toggleMenu(activeMenu?.menuTriggeredBtn, activeMenu?.menuDropdown);
    }
  });
}

function expandMenuDropdown(menuTriggeredBtn, menuDropdown) {
  menuTriggeredBtn.style.backgroundColor = "#656266";

  const menuItems = menuDropdown.querySelectorAll(".menuitem");
  menuItems[0].focus();

  //   close menu on 'esc' keypress
  menuDropdown.addEventListener("keyup", (event) => {
    if (event.key == "Escape") toggleMenu(menuTriggeredBtn, menuDropdown);
  });

  // add arrow keypress event to each menu item
  menuItems.forEach((menuItem, menuItemIndex, menuItems) => {
    menuItem.addEventListener("keyup", (event) => {
      handleArrowKeyPress(event, menuItemIndex, menuItems);
    });
  });

  //   prevent default browser action on arrow keypress
  window.addEventListener(
    "keydown",
    (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
          event.code
        ) > -1
      ) {
        event.preventDefault();
      }
    },
    false
  );

  detectOutsideClick(menuTriggeredBtn, menuDropdown);
}

function collapseMenuDropdown(menuTriggeredBtn) {
  menuTriggeredBtn.style.backgroundColor = "#303030";
  menuTriggeredBtn.focus();
}

function toggleMenu(menuTriggeredBtn, menuDropdown) {
  menuDropdown.classList.toggle("hide");

  const isExpanded = toggleAriaExpanded(menuTriggeredBtn);
  isExpanded
    ? collapseMenuDropdown(menuTriggeredBtn)
    : expandMenuDropdown(menuTriggeredBtn, menuDropdown);
}

function toggleAriaExpanded(element) {
  let isExpanded = element.attributes["aria-expanded"].value === "true";

  if (isExpanded) {
    element.ariaExpanded = "false";
    return true;
  } else {
    element.ariaExpanded = "true";
    return false;
  }
}

function toggleSetupGuideSteps(stepTab) {
  const activeTab = document.querySelector(".active");

  if (stepTab !== activeTab) {
    activeTab.classList.replace("active", "inactive");
    stepTab.classList.replace("inactive", "active");

    toggleAriaExpanded(activeTab);
    toggleAriaExpanded(stepTab);
  }
}

const HIDE_CLASS = "hide";
const IS_CHECKED = "checked";

function handleCompletedCheckbox(elements) {
  const {
    parentElement,
    childElements: {
      notCompletedCheckIcon,
      loadingCheckIcon,
      completedCheckIcon,
    },
  } = elements;

  // const checkboxStatus = parentElement.querySelector(".checkbox-status");
  const checkboxStatus = parentElement.querySelectorAll(".checkbox-status");
  checkboxStatus.ariaLabel = "Loading. Please Wait...";

  notCompletedCheckIcon.classList.add(HIDE_CLASS);
  loadingCheckIcon.classList.remove(HIDE_CLASS);

  setTimeout(() => {
    loadingCheckIcon.classList.add(HIDE_CLASS);
    completedCheckIcon.classList.remove(HIDE_CLASS);

    parentElement.classList.add(IS_CHECKED);
    parentElement.ariaLabel = parentElement.ariaLabel.replace(
      "as completed",
      "as not completed"
    );
    parentElement.ariaLabel = parentElement.ariaLabel.replace(
      "Check",
      "Uncheck"
    );
    parentElement.ariaChecked = "true";

    checkboxStatus.ariaLabel = parentElement.ariaLabel.replace(
      "Checked",
      "Successfully checked"
    );

    const nextStepTab =
      parentElement.parentElement.parentElement.nextElementSibling;
    if (nextStepTab) toggleSetupGuideSteps(nextStepTab);
  }, 500);
}

function handleNotCompletedCheckbox(elements) {
  const {
    parentElement,
    childElements: {
      notCompletedCheckIcon,
      loadingCheckIcon,
      completedCheckIcon,
    },
  } = elements;

  const checkboxStatus = parentElement.querySelectorAll(".checkbox-status");
  checkboxStatus.ariaLabel = "Loading. Please Wait...";

  completedCheckIcon.classList.add(HIDE_CLASS);
  loadingCheckIcon.classList.remove(HIDE_CLASS);

  setTimeout(() => {
    loadingCheckIcon.classList.add(HIDE_CLASS);
    notCompletedCheckIcon.classList.remove(HIDE_CLASS);

    parentElement.classList.remove(IS_CHECKED);
    parentElement.ariaLabel = parentElement.ariaLabel.replace(
      "as not completed",
      "as completed"
    );
    parentElement.ariaLabel = parentElement.ariaLabel.replace(
      "Uncheck",
      "Check"
    );
    parentElement.ariaChecked = "false";

    checkboxStatus.ariaLabel = parentElement.ariaLabel.replace(
      "Checked",
      "Successfully unchecked"
    );
  }, 500);
}

function handleCheckboxClick(parentElement) {
  const notCompletedCheckIcon = parentElement.querySelector(
    ".not-completed-check-icon"
  );
  const loadingCheckIcon = parentElement.querySelector(".loading-check-icon");
  const completedCheckIcon = parentElement.querySelector(
    ".completed-check-icon"
  );

  const elements = {
    parentElement,
    childElements: {
      notCompletedCheckIcon,
      loadingCheckIcon,
      completedCheckIcon,
    },
  };
  // console.log(elements);

  const isChecked = parentElement.classList.contains(IS_CHECKED);

  isChecked
    ? handleNotCompletedCheckbox(elements)
    : handleCompletedCheckbox(elements);

  handleCheckCount();
}

let checkCount = 0;

function handleCheckCount() {
  setTimeout(() => {
    allCheckboxes.forEach((checkbox) => {
      if (checkbox.classList.contains(IS_CHECKED)) checkCount += 1;
    });

    // update checks completed
    checksCompleted.innerText = checkCount;
    checkedStatus.ariaLabel = `${checkCount} of ${allCheckboxes.length} checks completed`;

    updateProgressBar(checkCount);
  }, 600);

  checkCount = 0; // reset count
}

function updateProgressBar(checkCount) {
  const percent = (checkCount * 100) / allCheckboxes.length;
  progressBar.style.width = `${percent}%`;
}

function handleAccordionClick() {
  setupGuideTab.classList.toggle(HIDE_CLASS);
  accordionUpElement.classList.toggle(HIDE_CLASS);
  accordionDownElement.classList.toggle(HIDE_CLASS);

  const isExpanded = toggleAriaExpanded(accordionBtnElement);
  if (isExpanded) allCheckboxes[0].focus();
}

app();
