import Chip from "@material-ui/core/Chip";

const TagChip = ({ tag }) => (
  <Chip key label={tag.name} color="secondary" style={{ margin: 5 }} />
);
export default TagChip;
