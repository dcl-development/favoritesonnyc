"use client";

import type { ChangeEvent } from "react";
import { Card, Flex, Grid, Label, Select, Stack, Switch, Text } from "@sanity/ui";
import { set, setIfMissing, unset, type FieldProps, type ObjectInputProps } from "sanity";
import { TIME_OPTIONS } from "../schemaTypes/hoursOptions";

type Day = { closed?: boolean; opens?: string; closes?: string };

/** The day field renders only its input: no field title, "…" menu, or comment button. */
export function DayHoursField(props: FieldProps) {
  return <>{props.children}</>;
}

/** One compact row per day: name + Closed switch, then Opens / Closes side by side. */
export function DayHoursInput(props: ObjectInputProps<Day>) {
  const { value, onChange, schemaType, readOnly, validation, id } = props;
  const closed = Boolean(value?.closed);
  const errors = validation.filter((item) => item.level === "error");

  const pick = (field: "opens" | "closes") => (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value;
    onChange([setIfMissing({}), next ? set(next, [field]) : unset([field])]);
  };

  const timeSelect = (field: "opens" | "closes", label: string) => (
    <Stack gap={2}>
      <Label as="label" htmlFor={`${id}-${field}`} size={1} muted>
        {label}
      </Label>
      <Select
        id={`${id}-${field}`}
        fontSize={2}
        padding={3}
        value={value?.[field] ?? ""}
        onChange={pick(field)}
        readOnly={readOnly}
        disabled={readOnly}
      >
        <option value="">–</option>
        {TIME_OPTIONS.map((time) => (
          <option key={time.value} value={time.value}>
            {time.title}
          </option>
        ))}
      </Select>
    </Stack>
  );

  return (
    <Card padding={3} radius={2} border tone={errors.length ? "critical" : "default"}>
      <Stack gap={3}>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={2} weight="semibold">
            {schemaType.title}
          </Text>
          <Flex as="label" align="center" gap={2} style={{ cursor: "pointer" }}>
            <Text size={1} muted>
              Closed
            </Text>
            <Switch
              checked={closed}
              disabled={readOnly}
              onChange={(event) =>
                onChange([setIfMissing({}), set(event.currentTarget.checked, ["closed"])])
              }
            />
          </Flex>
        </Flex>
        {closed ? (
          <Text size={1} muted>
            Closed all day
          </Text>
        ) : (
          <Grid gridTemplateColumns={2} gap={3}>
            {timeSelect("opens", "Opens")}
            {timeSelect("closes", "Closes")}
          </Grid>
        )}
        {errors.map((item, index) => (
          <Text key={index} size={1} style={{ color: "var(--card-fg-color)" }}>
            {item.message}
          </Text>
        ))}
      </Stack>
    </Card>
  );
}
