import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update token values contextually', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
        <Card elevation="lowRaised" padding="spacing.7" surfaceLevel={2}>
            <CardBody>
                <Text>
                    Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                </Text>
            </CardBody>
        </Card>

        <Card elevation="lowRaised" padding="spacing.7" surfaceLevel={3}>
            <CardBody>
                <Text>
                    Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                </Text>
            </CardBody>
        </Card>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
            <Card elevation="lowRaised" padding="spacing.7" backgroundColor="surface.background.gray.intense">
                <CardBody>
                    <Text>
                        Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                    </Text>
                </CardBody>
            </Card>

            <Card elevation="lowRaised" padding="spacing.7" backgroundColor="surface.background.gray.moderate">
                <CardBody>
                    <Text>
                        Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                    </Text>
                </CardBody>
            </Card>
            </>
          );"
  `);
});
