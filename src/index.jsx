import api from "@forge/api";
import ForgeUI, { render, Fragment, IssuePanel, IssueGlance } from "@forge/ui";
import { useIssueProperty } from "@forge/ui-jira";

import GlanceView from "./glance";
import Summary from "./summary";

const Panel = () => {
  const [checklistScore, _] = useIssueProperty(
    "priority-checklist-score",
    null
  );

  return (
    <Fragment>
      <Summary checklistScore={checklistScore} />
    </Fragment>
  );
};

export const panelView = render(
  <IssuePanel>
    <Panel />
  </IssuePanel>
);

export const glance = render(
  <IssueGlance>
    <GlanceView />
  </IssueGlance>
);
