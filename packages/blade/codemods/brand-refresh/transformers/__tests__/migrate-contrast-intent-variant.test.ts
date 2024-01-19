import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate contrast prop to emphasis', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <Badge contrast="low">Hello</Badge> 
          <Badge contrast="high">Hello</Badge> 

          <Text> Lorem Ipsum <Badge contrast="high">Hello</Badge> </Text>

          <Counter contrast="low">Hello</Counter> 
          <Counter contrast="high">Hello</Counter>

          <IconButton icon={CloseIcon} contrast="low" onClick={() => console.log('Clicked')} />
          <IconButton icon={CloseIcon} contrast="high" onClick={() => console.log('Clicked')} />
          
          <Alert description="Hello World" contrast="low" />
          <Alert description="Hello World" contrast="high" />

          <Skeleton height="50px" width="100%" contrast="low" />
          <Skeleton height="50px" width="100%" contrast="high" />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <Badge emphasis="subtle">Hello</Badge> 
              <Badge emphasis="intense">Hello</Badge> 

              <Text> Lorem Ipsum <Badge emphasis="intense">Hello</Badge> </Text>

              <Counter emphasis="subtle">Hello</Counter> 
              <Counter emphasis="intense">Hello</Counter>

              <IconButton icon={CloseIcon} emphasis="intense" onClick={() => console.log('Clicked')} />
              <IconButton icon={CloseIcon} emphasis="subtle" onClick={() => console.log('Clicked')} />
              
              <Alert description="Hello World" emphasis="subtle" />
              <Alert description="Hello World" emphasis="intense" />

              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
            </>
          );"
  `);
});

it('should remove variant/intent prop in favor of color prop', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
      <>
        <Alert description="Hello World" intent="information" />

        <Badge variant="blue"> Hello </Badge>
        <Badge color="default"> Hello </Badge>
        <Badge variant="blue" color="default"> Hello </Badge>
        <Badge variant="negative" color="positive"> Hello </Badge>

        <CardHeaderBadge variant="blue"> Hello </CardHeaderBadge>
        <CardHeaderBadge color="default"> Hello </CardHeaderBadge>
        <CardHeaderBadge variant="blue" color="default"> Hello </CardHeaderBadge>
        <CardHeaderBadge variant="negative" color="positive"> Hello </CardHeaderBadge>

        <Counter variant="blue"> Hello </Counter>
        <Counter intent="positive"> Hello </Counter>
        <Counter color="default"> Hello </Counter>
        <Counter variant="blue" intent="positive" color="default"> Hello </Counter>
        <Counter variant="negative" intent="notice" color="positive"> Hello </Counter>

        <CardHeaderCounter variant="blue"> Hello </CardHeaderCounter>
        <CardHeaderCounter intent="positive"> Hello </CardHeaderCounter>
        <CardHeaderCounter color="default"> Hello </CardHeaderCounter>
        <CardHeaderCounter variant="blue" intent="positive" color="default"> Hello </CardHeaderCounter>
        <CardHeaderCounter variant="negative" intent="notice" color="positive"> Hello </CardHeaderCounter>

        <Indicator intent="positive" />

        <Button variant="secondary" color="default"> Click Me </Button>
        <Button variant="secondary" color="white"> Click Me </Button>

        <CardHeaderIconButton variant="secondary" color="default"> Click Me </CardHeaderIconButton>
        <CardHeaderIconButton variant="secondary" color="white"> Click Me </CardHeaderIconButton>

        <Link color="default" href="https://github.com/razorpay/blade" variant="anchor">
          Learn More
        </Link>

        <CardHeaderLink color="default" href="https://github.com/razorpay/blade" variant="anchor">
          Learn More
        </CardHeaderLink>

        <ChipGroup defaultValue="yes">
          <Chip intent="positive" value="yes"> Yes </Chip>
          <Chip intent="negative" value="no"> No </Chip>
        </ChipGroup>

        <ChipGroup defaultValue="yes" intent="none">
          <Chip value="yes" intent="none"> Yes </Chip>
          <Chip value="no" intent="none"> No </Chip>
        </ChipGroup>

        <ChipGroup defaultValue="yes" color="default">
          <Chip value="yes" color="default"> Yes </Chip>
          <Chip value="no" color="default"> No </Chip>
        </ChipGroup>

        <Amount intent="positive" value={1234} />

        <CardHeaderAmount intent="positive" value={1234} />

        <ProgressBar intent="positive" label="Label" size="medium" value={10} />
        <ProgressBar intent="positive" label="Label" size="medium" value={10}  contrast="low"  />
        <ProgressBar intent="positive" label="Label" size="medium" value={10}  contrast="high"  />

        <Spinner contrast="high" />
        <Spinner contrast="low" />
        <Spinner color="default" />
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
          <>
            <Alert description="Hello World" color="information" />

            <Badge color="primary"> Hello </Badge>
            <Badge color="primary"> Hello </Badge>
            <Badge color="primary"> Hello </Badge>
            <Badge color="positive"> Hello </Badge>

            <CardHeaderBadge color="primary"> Hello </CardHeaderBadge>
            <CardHeaderBadge color="primary"> Hello </CardHeaderBadge>
            <CardHeaderBadge color="primary"> Hello </CardHeaderBadge>
            <CardHeaderBadge color="positive"> Hello </CardHeaderBadge>

            <Counter color="primary"> Hello </Counter>
            <Counter color="positive"> Hello </Counter>
            <Counter color="primary"> Hello </Counter>
            <Counter color="primary"> Hello </Counter>
            <Counter color="positive"> Hello </Counter>

            <CardHeaderCounter color="primary"> Hello </CardHeaderCounter>
            <CardHeaderCounter color="positive"> Hello </CardHeaderCounter>
            <CardHeaderCounter color="primary"> Hello </CardHeaderCounter>
            <CardHeaderCounter color="primary"> Hello </CardHeaderCounter>
            <CardHeaderCounter color="positive"> Hello </CardHeaderCounter>

            <Indicator color="positive" />

            <Button variant="secondary" color="primary"> Click Me </Button>
            <Button variant="secondary" color="white"> Click Me </Button>

            <CardHeaderIconButton variant="secondary" color="primary"> Click Me </CardHeaderIconButton>
            <CardHeaderIconButton variant="secondary" color="white"> Click Me </CardHeaderIconButton>

            <Link color="primary" href="https://github.com/razorpay/blade" variant="anchor">
              Learn More
            </Link>

            <CardHeaderLink color="primary" href="https://github.com/razorpay/blade" variant="anchor">
              Learn More
            </CardHeaderLink>

            <ChipGroup defaultValue="yes">
              <Chip value="yes" color="positive"> Yes </Chip>
              <Chip value="no" color="negative"> No </Chip>
            </ChipGroup>

            <ChipGroup defaultValue="yes" color="primary">
              <Chip value="yes" color="primary"> Yes </Chip>
              <Chip value="no" color="primary"> No </Chip>
            </ChipGroup>

            <ChipGroup defaultValue="yes" color="primary">
              <Chip value="yes" color="primary"> Yes </Chip>
              <Chip value="no" color="primary"> No </Chip>
            </ChipGroup>

            <Amount color="feedback.text.positive.intense" value={1234} />

            <CardHeaderAmount color="feedback.text.positive.intense" value={1234} />

            <ProgressBar label="Label" size="medium" value={10} color="positive" />
            <ProgressBar label="Label" size="medium" value={10} color="positive" />
            <ProgressBar label="Label" size="medium" value={10} contrast="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"  color="positive"  />

            <Spinner color="white" />
            <Spinner color="primary" />
            <Spinner color="primary" />
          </>
        );"
  `);
});
