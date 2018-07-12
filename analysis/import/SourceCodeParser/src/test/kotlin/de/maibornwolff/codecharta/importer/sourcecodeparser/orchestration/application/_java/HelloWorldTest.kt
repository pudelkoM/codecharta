package de.maibornwolff.codecharta.importer.sourcecodeparser.orchestration.application._java

import de.maibornwolff.codecharta.importer.sourcecodeparser.core.domain.metrics.MetricType
import de.maibornwolff.codecharta.importer.sourcecodeparser.orchestration.application.calculateDetailedMetrics
import de.maibornwolff.codecharta.importer.sourcecodeparser.test_helpers.assertWithPrintOnFail
import de.maibornwolff.codecharta.importer.sourcecodeparser.test_helpers.detailedSourceProviderFromResource
import de.maibornwolff.codecharta.importer.sourcecodeparser.test_helpers.javaApplicationFolder
import org.junit.Test
import java.io.IOException

class HelloWorldTest {

    @Test
    @Throws(IOException::class)
    fun `example has correctl real lines of code`() {
        val resource = "$javaApplicationFolder/HelloWorld.java"
        val locationResolverStub = detailedSourceProviderFromResource(resource)

        val singleMetrics = calculateDetailedMetrics(locationResolverStub)

        assertWithPrintOnFail(singleMetrics) { it.sum[MetricType.RLoc] }.isEqualTo(107)
    }
}