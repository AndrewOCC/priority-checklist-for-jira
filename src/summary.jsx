import api from "@forge/api";
import ForgeUI, {
  Badge,
  Button,
  Fragment,
  Text,
  useState,
  useProductContext,
} from "@forge/ui";

// maps checklist score to a priority checklist score lower bound
const priorityThresholds = {
  Critical: 7,
  Major: 5,
  Minor: 2,
};

export default (props) => {
  const context = useProductContext();
  const { issueKey } = context.platformContext;

  const fetchPriorityForIssue = async () => {
    const res = await api.asUser().requestJira(`/rest/api/2/issue/${issueKey}`);

    const data = await res.json();
    console.log(data.fields.priority.name);
    return data.fields.priority.name;
  };

  const setPriorityForIssue = async (priority) => {
    const res = await api.asUser().requestJira(`/rest/api/2/issue/${issueKey}`);

    const data = await res.json();
    console.log(data.fields.priority.name);
    return data.fields.priority.name;
  };

  const [issuePriority, setIssuePriority] = useState(fetchPriorityForIssue);

  const setPriority = () => {
    // Set priority here
    setIssuePriority(priority);
    setPriorityForIssue();
  };

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

  // Suggested priority logic
  // if (suggestedPriority !== issuePriority) {
  //   return (
  //     <Fragment>
  //       <Text>
  //         Score: <Badge appearance="primary" text={checklistScore} />
  //         {"  |  "}Suggested Priority:{" "}
  //         <Badge appearance="primary" text={suggestedPriority} />
  //         {"  |  "} Current Priority: <Badge text={issuePriority} />
  //       </Text>
  //       <Button text="Set Suggested Priority" onClick={setPriority} />
  //     </Fragment>
  //   );
  // }

  return (
    <Text>
      Score: <Badge appearance="primary" text={checklistScore} />
      {"  |  "}Suggested Priority:{" "}
      <Badge appearance="primary" text={suggestedPriority} />
    </Text>
  );
};
