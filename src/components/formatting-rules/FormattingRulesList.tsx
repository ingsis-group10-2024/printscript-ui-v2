import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { useGetFormatRules, useModifyFormatRules } from "../../utils/queries.tsx";
import { queryClient } from "../../App.tsx";
import { Rule } from "../../types/Rule.ts";

const FormattingRulesList = () => {
  const [rules, setRules] = useState<Rule[] | undefined>([]);

  const { data, isLoading } = useGetFormatRules();
  const { mutateAsync, isLoading: isLoadingMutate } = useModifyFormatRules({
    onSuccess: () => queryClient.invalidateQueries('formatRules')
  });

  useEffect(() => {
    setRules(data);
  }, [data]);

  const handleValueChange = (rule: Rule, newValue: string | number) => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        return { ...r, value: newValue };
      } else {
        return r;
      }
    });
    setRules(newRules);
  };

  const handleNumberChange = (rule: Rule) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    handleValueChange(rule, isNaN(value) ? 0 : value);
  };

  const toggleRule = (rule: Rule) => () => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        return {...r, isActive: !r.isActive};
      } else {
        return r;
      }
    });
    setRules(newRules);
  };

  const addNewRule = () => {
    const newRule: Rule = {
      id: `${Date.now()}`,  // Usamos el timestamp como id único
      name: 'New Rule',
      isActive: false,
      value: ''
    };
    setRules([...rules ?? [], newRule]);
  };

  return (
      <Card style={{ padding: 16, margin: 16 }}>
        <Typography variant={"h6"}>Formatting rules</Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {
            isLoading || isLoadingMutate ? <Typography style={{ height: 80 }}>Loading...</Typography> :
                rules?.map((rule) => {
                  return (
                      <ListItem
                          key={rule.name}
                          disablePadding
                          style={{ height: 40 }}
                      >
                        <Checkbox
                            edge="start"
                            checked={rule.isActive}
                            disableRipple
                            onChange={toggleRule(rule)}
                        />
                        <ListItemText primary={rule.name} />
                        {typeof rule.value === 'number' ?
                            (<TextField
                                type="number"
                                variant={"standard"}
                                value={rule.value}
                                onChange={handleNumberChange(rule)}
                            />) : typeof rule.value === 'string' ?
                                (<TextField
                                    variant={"standard"}
                                    value={rule.value}
                                    onChange={e => handleValueChange(rule, e.target.value)}
                                />) : null
                        }
                      </ListItem>
                  );
                })
          }
        </List>
        <Box display="flex" flexDirection="column" gap={2} alignItems="flex-start">
          <Button
              disabled={isLoading}
              variant={"contained"}
              onClick={() => mutateAsync(rules ?? [])}
              sx={{ width: 'auto' }} // Establecer el ancho automático
          >
            Save
          </Button>
          <Button
              variant={"contained"}
              onClick={addNewRule}
              sx={{ width: 'auto' }} // Establecer el ancho automático
          >
            Add New Rule
          </Button>
        </Box>
      </Card>
  );
};

export default FormattingRulesList;
