import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { TextField, Checkbox, CircularProgress } from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const TAG_QUERY = gql`
  query orgs {
    Tag(filter: { name_not_contains: "[" }, orderBy: category_asc) {
      name
      opus_id
      category
    }
  }
`;

function TagAuto({ setTags, tags }) {
  const [value, setValue] = useState(tags || []);
  const [getTags, { data, loading, error }] = useLazyQuery(TAG_QUERY);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const needsTags = open && options.length === 0;

  useEffect(() => {
    setTags(value);
  }, [value]);

  useEffect(() => {
    if (!needsTags) {
      return undefined;
    }
    getTags();
  }, [needsTags]);

  useEffect(() => {
    if (data?.Tag) {
      setOptions(
        data.Tag.map((t) => {
          return { ...t, value: t.name };
        })
      );
    }
  }, [data]);

  return (
    <>
      <Autocomplete
        multiple
        limitTags={2}
        // style={{ width: 500 }}
        value={value}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(e, newValue) => {
          if (newValue && newValue.some((v) => !!v.inputValue)) {
            const inputValue = newValue.filter((v) => v.inputValue)[0];
            return;
          }
          setValue(newValue);
        }}
        groupBy={(option) => option.category}
        loading={loading}
        options={options}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.name === value.name}
        renderInput={(params) => (
          <TextField
            {...params}
            // variant="outlined"
            label="Tag(s)"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              //   style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </React.Fragment>
        )}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          return filtered;
        }}
      />
    </>
  );
}

export default TagAuto;
