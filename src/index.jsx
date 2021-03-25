import api from "@forge/api";
import ForgeUI, {
  render,
  Fragment,
  Text,
  IssuePanel,
  useProductContext,
  useState,
  StatusLozenge,
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
  const context = useProductContext();
  const [comments] = useState(
    async () => await fetchCommentsForIssue(context.platformContext.issueKey)
  );

  return (
    <Fragment>
      <Text>Number of comments on this issue: {comments.length}</Text>
    </Fragment>
  );
};

const EditScore = () => {
  return (
    <Fragment>
      <Text>Score: </Text>
      <StatusLozenge> 5 </StatusLozenge>
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
