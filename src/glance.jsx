import ForgeUI, {
  Button,
  ButtonSet,
  Checkbox,
  CheckboxGroup,
  Form,
  Fragment,
  Strong,
  Text,
  TextField,
  useProductContext,
  useState,
} from "@forge/ui";
import { useIssueProperty } from "@forge/ui-jira";
import { v4 as uuidv4 } from "uuid";

import Summary from "./summary";
import { testChecklistTemplate } from "./testData";

export default () => {
  const context = useProductContext();

  // Get template from project state
  const [checklistTemplate, setChecklistTemplate] = useState(
    testChecklistTemplate
  );

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

  const [editMode, setEditMode] = useState(false);

  const reset = (setShowConfirm) => {
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

  return (
    <Fragment>
      <Text>
        <Strong>Summary</Strong>
      </Text>
      <Summary checklistScore={checklistScore} />

      <Text>
        <Strong>Checklist</Strong>
      </Text>

      {editMode ? (
        <EditMode
          checklistTemplate={checklistTemplate}
          setChecklistTemplate={setChecklistTemplate}
          saveAction={() => {
            setEditMode(false);
          }}
        />
      ) : (
        <SetMode
          submit={setChecklist}
          checklistTemplate={checklistTemplate}
          checkedItems={checkedItems}
          editAction={() => {
            setEditMode(true);
          }}
          resetAction={reset}
        />
      )}
    </Fragment>
  );
};

// Form for setting the priority checklist score
const SetMode = (props) => {
  const {
    submit,
    checklistTemplate,
    checkedItems,
    editAction,
    resetAction,
  } = props;

  const [showConfirm, setShowConfirm] = useState(false);

  // The array of additional buttons.
  // These buttons align to the right of the submit button.
  const actionButtons = [
    <Button
      text="Reset"
      onClick={() => {
        setShowConfirm(true);
      }}
    />,
    <Button text="Edit" icon={"edit"} onClick={editAction} />,
  ];

  return (
    <Fragment>
      {!showConfirm ? (
        <Form
          onSubmit={submit}
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
        <Button
          onClick={() => resetAction(setShowConfirm)}
          text="Confirm Reset"
        />
      )}
    </Fragment>
  );
};

// Form for editing the the priority checklist template
const EditMode = (props) => {
  const {
    checklistTemplate: projectChecklistTemplate,
    setChecklistTemplate: setProjectChecklistTemplate,
    saveAction,
  } = props;

  const [checklistTemplate, setLocalChecklistTemplate] = useState(
    projectChecklistTemplate
  );

  const setChecklistTemplate = (value) => {
    setLocalChecklistTemplate(value);
    setProjectChecklistTemplate(value);
  };

  const templateCategories = checklistTemplate.length;
  const [numCategories, setNumCategories] = useState(templateCategories);
  const [tempChecklistTemplate, setTempChecklistTemplate] = useState(
    templateCategories
  );

  const submit = (formData) => {
    // Save changes to checklist
    const temp = checklistTemplate;
    console.log(formData);
    for (const itemUuid in formData) {
      for (const groupUUID in temp) {
        if (itemUuid in temp[groupUUID]) {
          temp[groupUUID].description = formData[itemUUID];
        }
      }
    }
    setChecklistTemplate(temp);
    // Return to menu
    saveAction();
  };
  const addGroup = () => {};

  const removeFromGroup = (groupUUID, itemUUID) => {
    const temp = checklistTemplate;
    const groupIndex = temp.findIndex((group) => group.uuid === groupUUID);
    const itemIndex = temp[groupIndex].items.findIndex(
      (item) => item.uuid === itemUUID
    );
    delete temp[groupIndex].items[itemIndex];
    setChecklistTemplate(temp);
  };
  const addToGroup = (groupUUID) => {
    const temp = checklistTemplate;
    for (const group in temp) {
      if (group.UUID == groupUUID) {
        group.push({ uuid: uuidv4(), description: "" });
      }
    }

    setChecklistTemplate(temp);
  };

  const actionButtons = [
    <Button text="Add Group" onClick={addGroup} icon="editor-add" />,
  ];

  return (
    <Form
      onSubmit={submit}
      submitButtonText={"Save Changes"}
      actionButtons={actionButtons}
    >
      {checklistTemplate.map((group) => {
        return (
          <Fragment>
            <Text>
              <Strong>{group.name}</Strong>
            </Text>
            {group.items.map((item) => (
              <Fragment>
                <TextField
                  name={item.uuid}
                  label={item.uuid}
                  defaultValue={item.description}
                />
                {/* <ButtonSet>
                  <Button
                    icon="editor-remove"
                    onClick={() => removeFromGroup(group.uuid, item.uuid)}
                  />
                  <Button
                    icon="editor-add"
                    onClick={() => addToGroup(group.uuid)}
                  />
                </ButtonSet> */}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Form>
  );
};
