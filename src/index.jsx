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

const fetchCommentsForIssue = async (issueId) => {
  const res = await api
    .asUser()
    .requestJira(`/rest/api/3/issue/${issueId}/comment`);

  const data = await res.json();
  return data.comments;
};

const Panel = () => {
  return (
    <Fragment>
      <Summary />
    </Fragment>
  );
};

const Summary = () => {
  return (
    <Text>
      Score: <Badge appearance="primary" text="10" />
      {"  |  "}Estimated Priority: <Badge appearance="primary" text="Low" />
    </Text>
  );
};

const EditScore = () => {
  const context = useProductContext();

  const checklistTemplate = [
    {
      name: "Bug-related:",
      items: [
        "Regression on past behaviour",
        "Blocks a team from upgrading and adopting",
        "Prevents documented functionality from working",
      ],
    },
    {
      name: "Improvement-related",
      items: [
        "Fixes an inconsistency in the design system",
        "Improves the experience for end-users",
        "Follow-up to design work that’s been completed by the team",
        "Unblocks other tickets in our backlog",
        "Common request from consumers",
        "Makes the component more composable",
      ],
    },
    {
      name: "Business / OKR Value",
      items: [
        "Improves the performance of our Design System",
        "Improves the accessibility of our Design System",
        "Improves the quality of our Design System",
        "Affects roadmapped work (DS or product)",
        "Impacts more than one product at Atlassian?",
      ],
    },
    {
      name: "Services / Tech debt",
      items: [
        "Helps prevent future issues from occurring",
        "Increases the stability, quality or reliability of a service?",
        "Improves the developer experience?",
      ],
    },
  ];

  console.log(checklistTemplate.length);

  // Create empty array of bools to represent checklist
  var checklistDerivedState = [];
  for (var i = 0; i < checklistTemplate.length, i++; ) {
    var temp = [];
    for (const _ in checklistTemplate[i].items) {
      temp.push("word");
    }
    checklistDerivedState.push(temp);
  }

  // replace checklistTemplate with the ticket's checklist state
  const [checklistState, setChecklistState] = useState(checklistDerivedState);

  console.log("checklistState: ", checklistState);

  const edit = () => {};
  const reset = () => {};
  const setChecklist = () => {};

  // The array of additional buttons.
  // These buttons align to the right of the submit button.
  const actionButtons = [
    <Button text="Edit" onClick={edit} />,
    <Button text="Reset" onClick={reset} />,
  ];

  return (
    <Fragment>
      <Text>
        <Strong>Summary</Strong>
      </Text>
      <Summary />

      <Text>
        <Strong>Checklist</Strong>
      </Text>

      <Form
        onSubmit={setChecklist}
        submitButtonText="Save"
        actionButtons={actionButtons}
      >
        {checklistTemplate.map((value, index) => {
          const groupIndex = index;
          return (
            <CheckboxGroup label={value.name} name={value.name}>
              {value.items.map((value, index) => (
                <Checkbox
                  defaultChecked={
                    checklistDerivedState[groupIndex]
                      ? checklistDerivedState[groupIndex][index]
                      : false
                  }
                  value={index}
                  label={value}
                />
              ))}
            </CheckboxGroup>
          );
        })}
      </Form>
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
