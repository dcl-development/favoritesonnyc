"use client";

import type { ChangeEvent } from "react";
import { Card, Flex, Grid, Label, Select, Stack, Switch, Text, TextInput } from "@sanity/ui";
import { set, setIfMissing, unset, type FieldProps, type ObjectInputProps } from "sanity";

export const SYNC_NOTE =
  "This only changes the website. Google, Toast reservations, and Apple Maps or Yelp (if you use them) don’t update from here, so change your hours there too.";
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

type Special = Day & { date?: string; until?: string; note?: string };

/** One special date: date + Closed switch, then Opens / Closes, then an optional note. */
export function SpecialDateInput(props: ObjectInputProps<Special>) {
  const { value, onChange, readOnly, validation, id } = props;
  const closed = Boolean(value?.closed);
  const errors = validation.filter((item) => item.level === "error");

  const setField = (field: keyof Special, next: string | boolean) =>
    onChange([setIfMissing({}), next === "" ? unset([field]) : set(next, [field])]);

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
        onChange={(event: ChangeEvent<HTMLSelectElement>) => setField(field, event.currentTarget.value)}
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
    <Stack gap={4}>
      <Flex align="flex-end" gap={3}>
        <Stack gap={2} flex={1}>
          <Label as="label" htmlFor={`${id}-date`} size={1} muted>
            Date
          </Label>
          <TextInput
            id={`${id}-date`}
            type="date"
            fontSize={2}
            padding={3}
            value={value?.date ?? ""}
            onChange={(event) => setField("date", event.currentTarget.value)}
            readOnly={readOnly}
          />
        </Stack>
        <Flex as="label" align="center" gap={2} paddingBottom={2} style={{ cursor: "pointer" }}>
          <Text size={1} muted>
            Closed
          </Text>
          <Switch
            checked={closed}
            disabled={readOnly}
            onChange={(event) => setField("closed", event.currentTarget.checked)}
          />
        </Flex>
      </Flex>
      <Stack gap={2}>
        <Label as="label" htmlFor={`${id}-until`} size={1} muted>
          Until (optional)
        </Label>
        <TextInput
          id={`${id}-until`}
          type="date"
          fontSize={2}
          padding={3}
          min={value?.date}
          value={value?.until ?? ""}
          onChange={(event) => setField("until", event.currentTarget.value)}
          readOnly={readOnly}
        />
        <Text size={1} muted>
          Only for more than one day in a row. Leave empty for a single day.
        </Text>
      </Stack>
      {closed ? null : (
        <Grid gridTemplateColumns={2} gap={3}>
          {timeSelect("opens", "Opens")}
          {timeSelect("closes", "Closes")}
        </Grid>
      )}
      <Stack gap={2}>
        <Label as="label" htmlFor={`${id}-note`} size={1} muted>
          Note (optional)
        </Label>
        <TextInput
          id={`${id}-note`}
          fontSize={2}
          padding={3}
          maxLength={25}
          placeholder="thanksgiving"
          value={value?.note ?? ""}
          onChange={(event) => setField("note", event.currentTarget.value)}
          readOnly={readOnly}
        />
        <Text size={1} muted>
          Up to 25 characters, so it fits on the sign.
        </Text>
      </Stack>
      {errors.length ? (
        <Card padding={3} radius={2} tone="critical">
          <Stack gap={2}>
            {errors.map((item, index) => (
              <Text key={index} size={1}>
                {item.message}
              </Text>
            ))}
          </Stack>
        </Card>
      ) : null}
    </Stack>
  );
}

/** The Opening hours form, with a "not synced" note on top. */
export function HoursDocumentInput(props: ObjectInputProps) {
  return (
    <Stack gap={5}>
      <Card padding={4} radius={2} tone="caution" border>
        <Stack gap={3}>
          <Text size={2} weight="semibold">
            Heads up: other listings don’t update
          </Text>
          <Text size={2}>{SYNC_NOTE}</Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
