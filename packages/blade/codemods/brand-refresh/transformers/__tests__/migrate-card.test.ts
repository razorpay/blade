import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the Card component', async () => {
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

            <Card>
                <CardHeader>
                    <CardHeaderLeading
                        title="Card Header"
                        subtitle="Subtitle"
                        prefix={<CardHeaderIcon icon={InfoIcon} />}
                        suffix={<CardHeaderCounter intent="positive" value={12} />}
                    />
                    <CardHeaderTrailing visual={<CardHeaderBadge variant="positive">NEW</CardHeaderBadge>} />
                </CardHeader>
                <CardBody>
                    <Text> Hello World</Text>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardHeaderLeading
                        title="Card Header"
                        subtitle="Subtitle"
                        prefix={<CardHeaderIcon icon={InfoIcon} />}
                        suffix={<CardHeaderCounter intent="positive" value={12} />}
                    />
                    <CardHeaderTrailing visual={<CardHeaderText weight="bold">NEW</CardHeaderText>} />
                </CardHeader>
                <CardBody>
                    <Text> Hello World</Text>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardHeaderLeading
                        title="Card Header"
                        subtitle="Subtitle"
                        prefix={<CardHeaderIcon icon={InfoIcon} />}
                        suffix={<CardHeaderCounter intent="positive" value={12} />}
                    />
                    <CardHeaderTrailing visual={<CardHeaderIconButton color="default">NEW</CardHeaderIconButton>} />
                </CardHeader>
                <CardBody>
                    <Text> Hello World</Text>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardHeaderLeading
                        title="Card Header"
                        subtitle="Subtitle"
                        prefix={<CardHeaderIcon icon={InfoIcon} />}
                        suffix={<CardHeaderCounter intent="positive" value={12} />}
                    />
                    <CardHeaderTrailing
                        visual={<CardHeaderAmount value={123} intent="positive" size="title-small" />}
                    />
                </CardHeader>
                <CardBody>
                    <Text> Hello World</Text>
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
                <Card elevation="lowRaised" padding="spacing.7" backgroundColor="surface.background.gray.moderate">
                    <CardBody>
                        <Text>
                            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                        </Text>
                    </CardBody>
                </Card>

                <Card elevation="lowRaised" padding="spacing.7" backgroundColor="surface.background.gray.intense">
                    <CardBody>
                        <Text>
                            Create Razorpay Payments Links and share them with your customers from the Razorpay Dashboard or using APIs and start accepting payments. Check the advantages, payment methods, international currency support and more.
                        </Text>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardHeaderLeading
                            title="Card Header"
                            subtitle="Subtitle"
                            prefix={<CardHeaderIcon icon={InfoIcon} />}
                            suffix={<CardHeaderCounter value={12} color="positive" />}
                        />
                        <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
                    </CardHeader>
                    <CardBody>
                        <Text> Hello World</Text>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardHeaderLeading
                            title="Card Header"
                            subtitle="Subtitle"
                            prefix={<CardHeaderIcon icon={InfoIcon} />}
                            suffix={<CardHeaderCounter value={12} color="positive" />}
                        />
                        <CardHeaderTrailing visual={<CardHeaderText weight="semibold">NEW</CardHeaderText>} />
                    </CardHeader>
                    <CardBody>
                        <Text> Hello World</Text>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardHeaderLeading
                            title="Card Header"
                            subtitle="Subtitle"
                            prefix={<CardHeaderIcon icon={InfoIcon} />}
                            suffix={<CardHeaderCounter value={12} color="positive" />}
                        />
                        <CardHeaderTrailing visual={<CardHeaderIconButton color="primary">NEW</CardHeaderIconButton>} />
                    </CardHeader>
                    <CardBody>
                        <Text> Hello World</Text>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardHeaderLeading
                            title="Card Header"
                            subtitle="Subtitle"
                            prefix={<CardHeaderIcon icon={InfoIcon} />}
                            suffix={<CardHeaderCounter value={12} color="positive" />}
                        />
                        <CardHeaderTrailing
                            visual={<CardHeaderAmount
                                value={123}
                                color="feedback.text.positive.intense"
                                type="heading"
                                size="large" />}
                        />
                    </CardHeader>
                    <CardBody>
                        <Text> Hello World</Text>
                    </CardBody>
                </Card>
            </>
          );"
  `);
});
