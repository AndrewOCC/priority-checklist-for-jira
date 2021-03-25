import api from "@forge/api";
import ForgeUI, {
  render,
  Button,
  CheckboxGroup,
  Checkbox,
  Heading,
  Strong,
  Form,
  Badge,
  Fragment,
  Text,
  IssuePanel,
  useProductContext,
  useState,
  IssueGlance,
} from "@forge/ui";
import { useIssueProperty } from "@forge/ui-jira";

import { v4 as uuidv4 } from "uuid";

const fetchCommentsForIssue = async (issueId) => {
  const res = await api
    .asUser()
    .requestJira(`/rest/api/3/issue/${issueId}/comment`);

  const data = await res.json();
  return data.comments;
};

// maps checklist score to a priority checklist score lower bound
const priorityThresholds = {
  critical: 7,
  major: 5,
  minor: 2,
};

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

const Summary = (props) => {
  const { checklistScore } = props;

  // Set suggested priority
  var suggestedPriority = "trivial";
  for (const priority in priorityThresholds) {
    if (checklistScore >= priorityThresholds[priority]) {
      suggestedPriority = priority;
      break;
    }
  }

  // Handle case where user hasn't filled out checklist yet
  if (checklistScore === null) {
    console.log("rendering!");
    return (
      <Fragment>
        <Text>
          Priority Checklist Score:
          <Badge appearance="removed" text="Unset" />
        </Text>
      </Fragment>
    );
  }

  return (
    <Text>
      Score: <Badge appearance="primary" text={checklistScore} />
      {"  |  "}Suggested Priority:{" "}
      <Badge appearance="primary" text={suggestedPriority} />
    </Text>
  );
};

const EditScore = () => {
  const context = useProductContext();

  // Get template from project state
  const checklistTemplate = [
    {
      uuid: "a5625121-7296-490b-9cca-4f01f8a1d86c",
      name: "Bug-related:",
      items: [
        {
          uuid: "cac866ef-a529-4abf-81d5-d27cebaef3e0",
          description: "Regression on past behaviour",
        },
        {
          uuid: "9d4e01ef-3f41-433e-a2e3-5af5ef26a5f4",
          description: "Blocks a team from upgrading and adopting",
        },
        {
          uuid: "41176696-599d-4bbf-897f-3348a16b1dc0",
          description: "Prevents documented functionality from working",
        },
      ],
    },
    {
      uuid: "01208b5a-1296-41d6-8cdb-e6321c11b49f",
      name: "Improvement-related",
      items: [
        {
          uuid: "5b9dadd8-b370-414d-81e0-c53fe11da058",
          description: "Fixes an inconsistency in the design system",
        },
        {
          uuid: "f53017c0-2051-4075-96c0-3083ca1a68ed",
          description: "Improves the experience for end-users",
        },
        {
          uuid: "3db7c665-f248-41cf-911e-055e59e1c935",
          description:
            "Follow-up to design work that’s been completed by the team",
        },
        {
          uuid: "53f68cb4-5b4b-41e7-aec6-d83daa524269",
          description: "Unblocks other tickets in our backlog",
        },
        {
          uuid: "f7d5d523-9c86-467e-924c-b177edfd2ffb",
          description: "Common request from consumers",
        },
        {
          uuid: "091b5236-0af5-4363-9ec9-eba2606a423a",
          description: "Makes the component more composable",
        },
      ],
    },
  ];

  // Get checked items from ticket state
  const [issueCheckedItems, setIssueCheckedItems] = useIssueProperty(
    "priority-checklist-values",
    []
  );
  const [checkedItems, setLocalCheckedItems] = useState(issueCheckedItems);
  const setCheckedItems = (value) => {
    setLocalCheckedItems(value);
    setIssueCheckedItems(value);
  };

  // get checklist score and sync with local state
  const [issueChecklistScore, setIssueChecklistScore] = useIssueProperty(
    "priority-checklist-score",
    null
  );
  const [checklistScore, setLocalChecklistScore] = useState(
    issueChecklistScore
  );

  const setChecklistScore = (value) => {
    setLocalChecklistScore(value);
    setIssueChecklistScore(value);
  };

  const edit = () => {};

  const [showConfirm, setShowConfirm] = useState(false);
  const reset = () => {
    setCheckedItems([]);
    setChecklistScore(null);
    setShowConfirm(false);
  };

  const setChecklist = (formData) => {
    console.log(formData);
    var temp = [];
    for (const group in formData) {
      temp = [...temp, ...formData[group]];
    }
    setCheckedItems(temp);
    setChecklistScore(temp.length);
  };

  // The array of additional buttons.
  // These buttons align to the right of the submit button.
  const actionButtons = [
    <Button
      text="Reset"
      onClick={() => {
        setShowConfirm(true);
      }}
    />,
    <Button text="Edit" disabled={true} icon={"edit"} onClick={edit} />,
  ];

  return (
    <Fragment>
      <Text>
        <Strong>Summary</Strong>
      </Text>
      <Summary checklistScore={checklistScore} />

      <Text>
        <Strong>Checklist</Strong>
      </Text>

      {!showConfirm ? (
        <Form
          onSubmit={setChecklist}
          submitButtonText="Save"
          actionButtons={actionButtons}
        >
          {checklistTemplate.map((group) => {
            return (
              <CheckboxGroup name={group.uuid} label={group.name}>
                {group.items.map((item) => (
                  <Checkbox
                    defaultChecked={checkedItems.includes(item.uuid)}
                    value={item.uuid}
                    label={item.description}
                  />
                ))}
              </CheckboxGroup>
            );
          })}
        </Form>
      ) : (
        <Button onClick={reset} text="Confirm Reset" />
      )}
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
    <EditScore />
  </IssueGlance>
);
