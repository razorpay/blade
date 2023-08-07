# AutoComplete

## Uncontrolled

```jsx
<Dropdown>
  <AutoComplete label="Select City" />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Pune" value="pune" />
      <ActionListItem title="Hyderabad" value="hyderabad" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>
```

## Controlled Filtering

```jsx
const allCities = ['Mumbai', 'Pune', 'Hyderabad'];

const ControlledAutoComplete = () => {
  const [cities, setCities] = React.useState(allCities);

  return (
    <Dropdown>
      <AutoComplete
        label="Select City"
        onChange={(inputValue) => {
          if (inputValue) {
            setCities(allCities.filter((city) => city.includes(inputValue)));
          } else {
            setCities(allCities);
          }
        }}
      />
      <DropdownOverlay>
        <ActionList>
          {cities.map((city) => (
            <ActionListItem title={city} value={city.toLowerCase()} />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
```
